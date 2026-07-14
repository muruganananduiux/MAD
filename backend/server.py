from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Cookie, Header
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta, timezone
import os, uuid, hmac, hashlib, logging
from pathlib import Path

import bcrypt
import jwt as pyjwt
import httpx

try:
    import razorpay
except Exception:
    razorpay = None

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '').strip()
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '').strip()
RAZORPAY_WEBHOOK_SECRET = os.environ.get('RAZORPAY_WEBHOOK_SECRET', '').strip()
RAZORPAY_ENABLED = bool(RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET and razorpay is not None)

rzp_client = None
if RAZORPAY_ENABLED:
    try:
        rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    except Exception as e:
        logging.error(f'Razorpay init failed: {e}')
        RAZORPAY_ENABLED = False

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title='MAD API')
api = APIRouter(prefix='/api')

# -------------------- Models --------------------
class User(BaseModel):
    user_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    provider: str = 'password'  # 'password' | 'google'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SignupIn(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class AuthOut(BaseModel):
    user: dict
    token: str

class CampaignIn(BaseModel):
    cause: str
    title: str
    goal: int
    story: str
    beneficiary: str
    phone: Optional[str] = None
    image: Optional[str] = None

class CampaignOut(BaseModel):
    id: str
    cause: str
    title: str
    goal: int
    raised: int
    story: str
    beneficiary: str
    image: Optional[str] = None
    created_by: Optional[str] = None
    status: str
    created_at: datetime

class DonationCreate(BaseModel):
    campaign_id: str
    amount: int  # in INR (rupees)
    donor_name: str
    donor_email: EmailStr
    donor_phone: Optional[str] = None
    pan: Optional[str] = None
    anonymous: bool = False
    message: Optional[str] = None

class VerifyPayment(BaseModel):
    order_id: str
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None

class NewsletterIn(BaseModel):
    email: EmailStr

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    budget: Optional[str] = None
    message: Optional[str] = None
    kind: str = 'csr'  # 'csr' | 'general'

# -------------------- Helpers --------------------
def hash_password(pwd: str) -> str:
    return bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(pwd: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pwd.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

def create_jwt(user_id: str, email: str) -> str:
    payload = {
        'sub': user_id,
        'email': email,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(days=7),
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm='HS256')

def decode_jwt(token: str) -> Optional[dict]:
    try:
        return pyjwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except Exception:
        return None

async def get_user_from_token_or_session(request: Request):
    # 1. Try Bearer JWT
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        payload = decode_jwt(auth[7:])
        if payload:
            u = await db.users.find_one({'user_id': payload['sub']}, {'_id': 0, 'password': 0})
            if u:
                return u
    # 2. Try session_token cookie (Emergent auth)
    session_token = request.cookies.get('session_token')
    if session_token:
        sess = await db.user_sessions.find_one({'session_token': session_token}, {'_id': 0})
        if sess:
            expires_at = sess.get('expires_at')
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)
            if expires_at and expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at and expires_at > datetime.now(timezone.utc):
                u = await db.users.find_one({'user_id': sess['user_id']}, {'_id': 0, 'password': 0})
                if u:
                    return u
    return None

async def require_user(request: Request):
    u = await get_user_from_token_or_session(request)
    if not u:
        raise HTTPException(status_code=401, detail='Not authenticated')
    return u

# -------------------- Root --------------------
@api.get('/')
async def root():
    return {'ok': True, 'service': 'MAD API', 'razorpay_enabled': RAZORPAY_ENABLED}

@api.get('/health')
async def health():
    return {'status': 'ok', 'razorpay_enabled': RAZORPAY_ENABLED}

@api.get('/config')
async def config():
    return {'razorpay_enabled': RAZORPAY_ENABLED, 'razorpay_key_id': RAZORPAY_KEY_ID if RAZORPAY_ENABLED else ''}

# -------------------- Auth: JWT email/password --------------------
@api.post('/auth/signup', response_model=AuthOut)
async def signup(body: SignupIn):
    email = body.email.lower().strip()
    existing = await db.users.find_one({'email': email})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail='Password must be at least 6 characters')
    user_id = f'user_{uuid.uuid4().hex[:12]}'
    doc = {
        'user_id': user_id,
        'email': email,
        'name': body.name.strip(),
        'password': hash_password(body.password),
        'provider': 'password',
        'created_at': datetime.now(timezone.utc),
    }
    await db.users.insert_one(doc)
    token = create_jwt(user_id, email)
    user = {'user_id': user_id, 'email': email, 'name': body.name, 'provider': 'password'}
    return {'user': user, 'token': token}

@api.post('/auth/login', response_model=AuthOut)
async def login(body: LoginIn):
    email = body.email.lower().strip()
    u = await db.users.find_one({'email': email})
    if not u or not u.get('password'):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    if not verify_password(body.password, u['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    token = create_jwt(u['user_id'], email)
    user = {'user_id': u['user_id'], 'email': u['email'], 'name': u['name'], 'provider': u.get('provider', 'password')}
    return {'user': user, 'token': token}

@api.get('/auth/me')
async def me(request: Request):
    u = await get_user_from_token_or_session(request)
    if not u:
        raise HTTPException(status_code=401, detail='Not authenticated')
    return {'user_id': u['user_id'], 'email': u['email'], 'name': u['name'], 'picture': u.get('picture'), 'provider': u.get('provider')}

@api.post('/auth/logout')
async def logout(request: Request, response: Response):
    session_token = request.cookies.get('session_token')
    if session_token:
        await db.user_sessions.delete_one({'session_token': session_token})
    response.delete_cookie('session_token', path='/')
    return {'ok': True}

# -------------------- Auth: Emergent Google OAuth --------------------
@api.post('/auth/emergent/session')
async def emergent_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get('session_id')
    if not session_id:
        raise HTTPException(status_code=400, detail='session_id required')
    # Exchange session_id with Emergent auth service
    async with httpx.AsyncClient(timeout=10.0) as http:
        r = await http.get(
            'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
            headers={'X-Session-ID': session_id},
        )
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail='Invalid session_id')
    data = r.json()
    email = data['email'].lower()
    # Upsert user
    u = await db.users.find_one({'email': email})
    if not u:
        user_id = f'user_{uuid.uuid4().hex[:12]}'
        u = {
            'user_id': user_id,
            'email': email,
            'name': data.get('name', email.split('@')[0]),
            'picture': data.get('picture'),
            'provider': 'google',
            'created_at': datetime.now(timezone.utc),
        }
        await db.users.insert_one(u)
    session_token = data['session_token']
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        'user_id': u['user_id'],
        'session_token': session_token,
        'created_at': datetime.now(timezone.utc),
        'expires_at': expires_at,
    })
    # Set httpOnly cookie
    response.set_cookie(
        key='session_token', value=session_token,
        max_age=7 * 24 * 60 * 60,
        httponly=True, secure=True, samesite='none', path='/',
    )
    return {
        'user': {'user_id': u['user_id'], 'email': u['email'], 'name': u['name'], 'picture': u.get('picture'), 'provider': 'google'},
        'session_token': session_token,
    }

# -------------------- Campaigns --------------------
@api.get('/campaigns')
async def list_campaigns(cause: Optional[str] = None, q: Optional[str] = None):
    query = {'status': {'$in': ['live', 'verified']}}
    if cause and cause != 'all':
        query['cause_slug'] = cause
    docs = await db.campaigns.find(query, {'_id': 0}).sort('created_at', -1).to_list(200)
    if q:
        ql = q.lower()
        docs = [d for d in docs if ql in d.get('title', '').lower()]
    return docs

@api.get('/campaigns/{cid}')
async def get_campaign(cid: str):
    c = await db.campaigns.find_one({'id': cid}, {'_id': 0})
    if not c:
        raise HTTPException(status_code=404, detail='Campaign not found')
    return c

@api.post('/campaigns')
async def create_campaign(body: CampaignIn, request: Request):
    u = await get_user_from_token_or_session(request)  # optional login
    cid = f'c_{uuid.uuid4().hex[:10]}'
    doc = {
        'id': cid,
        'cause_slug': body.cause,
        'cause': body.cause.replace('_', ' ').title(),
        'title': body.title,
        'goal': int(body.goal),
        'raised': 0,
        'story': body.story,
        'beneficiary': body.beneficiary,
        'phone': body.phone,
        'image': body.image,
        'created_by': u['user_id'] if u else None,
        'status': 'pending_review',
        'created_at': datetime.now(timezone.utc),
    }
    await db.campaigns.insert_one(doc)
    doc.pop('_id', None)
    return doc

# -------------------- Donations & Razorpay --------------------
@api.post('/donations/order')
async def create_order(body: DonationCreate, request: Request):
    if body.amount < 100:
        raise HTTPException(status_code=400, detail='Minimum donation is Rs. 100')
    user = await get_user_from_token_or_session(request)
    donation_id = f'd_{uuid.uuid4().hex[:12]}'
    amount_paise = int(body.amount) * 100

    order_id = None
    key_id = None
    demo = not RAZORPAY_ENABLED

    if RAZORPAY_ENABLED and rzp_client is not None:
        try:
            rzp_order = rzp_client.order.create({
                'amount': amount_paise,
                'currency': 'INR',
                'receipt': donation_id[:40],
                'payment_capture': 1,
                'notes': {'campaign_id': body.campaign_id, 'donor_email': body.donor_email},
            })
            order_id = rzp_order['id']
            key_id = RAZORPAY_KEY_ID
        except Exception as e:
            logging.exception('Razorpay order failed')
            demo = True

    if demo:
        order_id = f'order_DEMO_{uuid.uuid4().hex[:14]}'

    doc = {
        'donation_id': donation_id,
        'order_id': order_id,
        'campaign_id': body.campaign_id,
        'amount': int(body.amount),
        'amount_paise': amount_paise,
        'donor_name': body.donor_name,
        'donor_email': body.donor_email.lower(),
        'donor_phone': body.donor_phone,
        'pan': body.pan,
        'anonymous': body.anonymous,
        'message': body.message,
        'user_id': user['user_id'] if user else None,
        'status': 'created',
        'demo': demo,
        'created_at': datetime.now(timezone.utc),
    }
    await db.donations.insert_one(doc)
    return {
        'donation_id': donation_id,
        'order_id': order_id,
        'amount': int(body.amount),
        'amount_paise': amount_paise,
        'currency': 'INR',
        'key_id': key_id,
        'demo': demo,
    }

@api.post('/donations/verify')
async def verify_donation(body: VerifyPayment):
    doc = await db.donations.find_one({'order_id': body.order_id}, {'_id': 0})
    if not doc:
        raise HTTPException(status_code=404, detail='Order not found')

    if doc.get('demo') or not RAZORPAY_ENABLED:
        # Demo mode - mark as success
        txn_id = f'MAD{uuid.uuid4().hex[:8].upper()}'
        await db.donations.update_one({'order_id': body.order_id}, {'$set': {
            'status': 'success',
            'payment_id': txn_id,
            'verified_at': datetime.now(timezone.utc),
        }})
        await db.campaigns.update_one({'id': doc['campaign_id']}, {'$inc': {'raised': doc['amount']}})
        return {'success': True, 'demo': True, 'payment_id': txn_id, 'donation_id': doc['donation_id']}

    # Real signature verification
    if not (body.razorpay_payment_id and body.razorpay_signature):
        raise HTTPException(status_code=400, detail='Missing payment/signature')
    body_str = f"{body.order_id}|{body.razorpay_payment_id}"
    generated = hmac.new(RAZORPAY_KEY_SECRET.encode(), body_str.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(generated, body.razorpay_signature):
        await db.donations.update_one({'order_id': body.order_id}, {'$set': {'status': 'failed'}})
        raise HTTPException(status_code=400, detail='Signature verification failed')
    await db.donations.update_one({'order_id': body.order_id}, {'$set': {
        'status': 'success',
        'payment_id': body.razorpay_payment_id,
        'signature': body.razorpay_signature,
        'verified_at': datetime.now(timezone.utc),
    }})
    await db.campaigns.update_one({'id': doc['campaign_id']}, {'$inc': {'raised': doc['amount']}})
    return {'success': True, 'payment_id': body.razorpay_payment_id, 'donation_id': doc['donation_id']}

@api.post('/donations/webhook')
async def rzp_webhook(request: Request):
    if not RAZORPAY_WEBHOOK_SECRET:
        return {'ok': False, 'reason': 'no webhook secret configured'}
    payload = await request.body()
    signature = request.headers.get('X-Razorpay-Signature', '')
    expected = hmac.new(RAZORPAY_WEBHOOK_SECRET.encode(), payload, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail='Invalid signature')
    data = await request.json()
    await db.webhook_events.insert_one({'event': data.get('event'), 'payload': data, 'received_at': datetime.now(timezone.utc)})
    return {'ok': True}

@api.get('/donations/me')
async def my_donations(request: Request):
    u = await require_user(request)
    docs = await db.donations.find({'user_id': u['user_id']}, {'_id': 0}).sort('created_at', -1).to_list(200)
    return docs

# -------------------- Newsletter & Contact --------------------
@api.post('/newsletter')
async def newsletter(body: NewsletterIn):
    email = body.email.lower().strip()
    await db.newsletter.update_one({'email': email}, {'$set': {'email': email, 'subscribed_at': datetime.now(timezone.utc)}}, upsert=True)
    return {'ok': True}

@api.post('/contact')
async def contact(body: ContactIn):
    doc = body.dict()
    doc['created_at'] = datetime.now(timezone.utc)
    await db.contacts.insert_one(doc)
    return {'ok': True}

# -------------------- Seed --------------------
SEED_CAMPAIGNS = [
    {'id': 'c1', 'cause_slug': 'medical', 'cause': 'Medical Emergency', 'title': 'Help 6-year-old Aarav complete his heart surgery', 'goal': 1500000, 'raised': 720000, 'image': 'https://images.unsplash.com/photo-1635247054993-3346afdfd31e', 'beneficiary': 'Aarav Kumar, Jaipur', 'story': 'Aarav was diagnosed with a severe congenital heart defect. His father is a daily-wage worker and cannot afford the surgery cost. Every rupee counts.', 'status': 'live'},
    {'id': 'c2', 'cause_slug': 'disaster', 'cause': 'Disaster Relief', 'title': 'Rebuild homes for flood-hit families in Assam', 'goal': 2500000, 'raised': 920000, 'image': 'https://images.pexels.com/photos/5909876/pexels-photo-5909876.jpeg', 'beneficiary': '112 families, Barpeta district', 'story': 'The Brahmaputra floods have washed away homes of over a hundred families. We are providing shelter, food and rebuilding assistance.', 'status': 'live'},
    {'id': 'c3', 'cause_slug': 'education', 'cause': 'Education', 'title': 'Send 40 girls from Bundelkhand back to school', 'goal': 750000, 'raised': 460000, 'image': 'https://images.unsplash.com/photo-1522661067900-ab829854a57f', 'beneficiary': 'Asha Foundation, Chitrakoot', 'story': 'Forty first-generation learners need books, uniforms and a year of school fees to continue their education.', 'status': 'live'},
    {'id': 'c4', 'cause_slug': 'community', 'cause': 'Community Causes', 'title': 'Feed 500 elderly through winter in Varanasi', 'goal': 400000, 'raised': 210000, 'image': 'https://images.unsplash.com/photo-1542810634-71277d95dcbb', 'beneficiary': 'Seva Ashram, Varanasi', 'story': 'Hot meals and warm blankets for abandoned elders through the harsh winter months.', 'status': 'live'},
    {'id': 'c5', 'cause_slug': 'animal', 'cause': 'Animal Welfare', 'title': 'Save injured street dogs of South Delhi', 'goal': 300000, 'raised': 145000, 'image': 'https://images.unsplash.com/photo-1524069290683-0457abfe42c3', 'beneficiary': 'Paws & Claws Rescue', 'story': 'Medical care, sterilisation and shelter for hundreds of rescued street animals every month.', 'status': 'live'},
    {'id': 'c6', 'cause_slug': 'medical', 'cause': 'Medical Emergency', 'title': 'Cancer treatment for young mother Priya', 'goal': 900000, 'raised': 380000, 'image': 'https://images.pexels.com/photos/37145167/pexels-photo-37145167.jpeg', 'beneficiary': 'Priya Sharma, Lucknow', 'story': 'A 32-year-old mother of two battling stage-3 breast cancer. Chemotherapy is ongoing and every session matters.', 'status': 'live'},
]

@app.on_event('startup')
async def on_start():
    count = await db.campaigns.count_documents({})
    if count == 0:
        for c in SEED_CAMPAIGNS:
            c['created_at'] = datetime.now(timezone.utc)
        await db.campaigns.insert_many(SEED_CAMPAIGNS)
        logging.info(f'Seeded {len(SEED_CAMPAIGNS)} campaigns')

@app.on_event('shutdown')
async def on_stop():
    client.close()

# -------------------- Wire up --------------------
app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
