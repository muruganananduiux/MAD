"""
Phase 1 auth backend tests for MAD Crowdfunding.

Scope (per E1's request): ONLY auth endpoints and roleMiddleware protection.
Does NOT exercise campaigns / donations / admin CRUD (those are still stubs).
"""
import os
import time
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fall back to frontend/.env for the ingress-facing URL (do not hardcode).
    with open("/app/frontend/.env", "r") as fh:
        for line in fh:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@mad.org"
ADMIN_PASSWORD = "Admin@12345"


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------
@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def dynamic_user():
    ts = int(time.time() * 1000)
    return {
        "name": "Phase1 Test",
        "email": f"phase1-{ts}-{uuid.uuid4().hex[:6]}@mad.org",
        "password": "Test@1234",
        "phone": "9990001111",
    }


@pytest.fixture(scope="session")
def registered_user(client, dynamic_user):
    """Register the dynamic user once and return the token payload."""
    r = client.post(f"{API}/auth/register", json=dynamic_user)
    assert r.status_code == 201, f"Register failed: {r.status_code} {r.text}"
    data = r.json()["data"]
    return {**dynamic_user, **data}


@pytest.fixture(scope="session")
def admin_login(client):
    r = client.post(
        f"{API}/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["data"]


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
class TestHealth:
    def test_health_ok(self, client):
        r = client.get(f"{API}/health")
        assert r.status_code == 200
        body = r.json()
        assert body.get("success") is True
        assert body.get("message") == "ok"
        assert "timestamp" in body


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------
class TestRegister:
    def test_register_returns_tokens_and_user(self, registered_user):
        assert registered_user["token"]
        assert registered_user["refreshToken"]
        u = registered_user["user"]
        assert u["email"] == registered_user["email"]
        assert u["name"] == registered_user["name"]
        assert u["role"] == "user"  # public register cannot self-elevate
        assert "id" in u
        # security: password must never be echoed
        assert "password" not in u

    def test_register_cannot_self_elevate_to_admin(self, client):
        payload = {
            "name": "Sneaky",
            "email": f"sneak-{uuid.uuid4().hex[:8]}@mad.org",
            "password": "Test@1234",
            "role": "admin",
        }
        r = client.post(f"{API}/auth/register", json=payload)
        # validator rejects role != user/ngo → 400
        assert r.status_code == 400

    def test_register_duplicate_email_rejected(self, client, registered_user):
        r = client.post(
            f"{API}/auth/register",
            json={
                "name": registered_user["name"],
                "email": registered_user["email"],
                "password": "AnotherPass1!",
            },
        )
        # spec allows 400 or 409
        assert r.status_code in (400, 409)
        body = r.json()
        assert body.get("success") is False
        assert "exist" in (body.get("message") or "").lower()

    def test_register_invalid_email_400(self, client):
        r = client.post(
            f"{API}/auth/register",
            json={"name": "Bad", "email": "not-an-email", "password": "Test@1234"},
        )
        assert r.status_code == 400

    def test_register_short_password_400(self, client):
        r = client.post(
            f"{API}/auth/register",
            json={"name": "Bad", "email": f"x-{uuid.uuid4().hex[:6]}@mad.org", "password": "12"},
        )
        assert r.status_code == 400


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------
class TestLogin:
    def test_login_success(self, client, registered_user):
        r = client.post(
            f"{API}/auth/login",
            json={"email": registered_user["email"], "password": registered_user["password"]},
        )
        assert r.status_code == 200
        data = r.json()["data"]
        assert data["token"]
        assert data["refreshToken"]
        assert data["user"]["email"] == registered_user["email"]

    def test_login_wrong_password_401(self, client, registered_user):
        r = client.post(
            f"{API}/auth/login",
            json={"email": registered_user["email"], "password": "totally-wrong"},
        )
        assert r.status_code == 401

    def test_login_unknown_email_401(self, client):
        r = client.post(
            f"{API}/auth/login",
            json={"email": f"noone-{uuid.uuid4().hex[:6]}@mad.org", "password": "whatever1"},
        )
        assert r.status_code == 401

    def test_admin_login_role_admin(self, admin_login):
        assert admin_login["user"]["role"] == "admin"
        assert admin_login["user"]["email"] == ADMIN_EMAIL


# ---------------------------------------------------------------------------
# /auth/me
# ---------------------------------------------------------------------------
class TestMe:
    def test_me_requires_token(self, client):
        r = client.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token_returns_user(self, client, registered_user):
        r = client.get(
            f"{API}/auth/me",
            headers={"Authorization": f"Bearer {registered_user['token']}"},
        )
        assert r.status_code == 200
        u = r.json()["data"]["user"]
        assert u["email"] == registered_user["email"]
        assert u["role"] == "user"

    def test_me_with_invalid_token_401(self, client):
        r = client.get(
            f"{API}/auth/me",
            headers={"Authorization": "Bearer not.a.jwt"},
        )
        assert r.status_code == 401


# ---------------------------------------------------------------------------
# Refresh + logout
# ---------------------------------------------------------------------------
class TestRefreshAndLogout:
    def test_refresh_success(self, client, registered_user):
        old_refresh = registered_user["refreshToken"]
        r = client.post(f"{API}/auth/refresh-token", json={"refreshToken": old_refresh})
        assert r.status_code == 200, r.text
        new_data = r.json()["data"]
        assert new_data["token"]
        assert new_data["refreshToken"]
        # rotation: new refresh must be different from the old one
        assert new_data["refreshToken"] != old_refresh
        # update fixture's tokens so later tests use the rotated pair
        registered_user["token"] = new_data["token"]
        registered_user["refreshToken"] = new_data["refreshToken"]

    def test_refresh_with_old_revoked_token_401(self, client, registered_user):
        """We just rotated in the previous test — grab a fresh pair now and
        try to reuse the previous refresh (which the server should have deleted)."""
        # Rotate once more to get a token we can revoke deterministically.
        r = client.post(
            f"{API}/auth/refresh-token",
            json={"refreshToken": registered_user["refreshToken"]},
        )
        assert r.status_code == 200
        rotated = r.json()["data"]
        stale_refresh = registered_user["refreshToken"]  # this was just deleted server-side
        registered_user["token"] = rotated["token"]
        registered_user["refreshToken"] = rotated["refreshToken"]

        r2 = client.post(f"{API}/auth/refresh-token", json={"refreshToken": stale_refresh})
        assert r2.status_code == 401

    def test_refresh_with_garbage_token_401(self, client):
        r = client.post(f"{API}/auth/refresh-token", json={"refreshToken": "garbage"})
        assert r.status_code == 401

    def test_refresh_without_body_400(self, client):
        r = client.post(f"{API}/auth/refresh-token", json={})
        assert r.status_code == 400

    def test_logout_revokes_refresh(self, client, registered_user):
        # logout the current refresh; subsequent refresh with same token must 401
        current_refresh = registered_user["refreshToken"]
        r = client.post(
            f"{API}/auth/logout",
            headers={"Authorization": f"Bearer {registered_user['token']}"},
            json={"refreshToken": current_refresh},
        )
        assert r.status_code == 200
        r2 = client.post(f"{API}/auth/refresh-token", json={"refreshToken": current_refresh})
        assert r2.status_code == 401


# ---------------------------------------------------------------------------
# Role middleware on /api/admin/dashboard
# ---------------------------------------------------------------------------
class TestRoleMiddleware:
    def test_admin_dashboard_no_token_401(self, client):
        r = client.get(f"{API}/admin/dashboard")
        assert r.status_code == 401

    def test_admin_dashboard_user_token_403(self, client, dynamic_user):
        # Login the standard user afresh (previous refresh was revoked; but the
        # ACCESS token still may be valid until its 15m TTL — safest is to log in
        # again to get a brand new access token).
        r = client.post(
            f"{API}/auth/login",
            json={"email": dynamic_user["email"], "password": dynamic_user["password"]},
        )
        assert r.status_code == 200
        user_token = r.json()["data"]["token"]

        r2 = client.get(
            f"{API}/admin/dashboard",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert r2.status_code == 403

    def test_admin_dashboard_admin_token_200(self, client, admin_login):
        r = client.get(
            f"{API}/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_login['token']}"},
        )
        # 200 with success:true; response body shape can vary — just ensure OK.
        assert r.status_code == 200
        body = r.json()
        assert body.get("success") is True
