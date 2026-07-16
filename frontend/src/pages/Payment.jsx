import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatINR } from '@/data';
import {
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  ShieldCheck,
  Check,
  Copy,
  QrCode,
  ExternalLink
} from 'lucide-react';

import QRCode from "react-qr-code";
import { toast } from 'sonner';

const METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, sub: 'GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Card', icon: CreditCard, sub: 'Credit / Debit' },
  { id: 'netbanking', label: 'Netbanking', icon: Landmark, sub: 'All Indian banks' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, sub: 'Paytm, Amazon Pay' },
];

export default function Payment() {
  const nav = useNavigate();
  const donation = useMemo(() => JSON.parse(localStorage.getItem('mad_pending_donation') || 'null'), []);
  const [method, setMethod] = useState('upi');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [selectedApp, setSelectedApp] = useState("gpay");
  const [processing, setProcessing] = useState(false);
  const upiId = "madngo@upi";

const upiLink = `upi://pay?pa=${upiId}&pn=MAD Donation&am=${donation?.amount || 0}&cu=INR`;
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (!donation) nav('/all-causes'); }, [donation, nav]);
  if (!donation) return null;

  const pay = () => {
   if (method === 'upi' && !selectedApp)
  return toast.error('Please select a UPI app');
    if (method === 'card' && (card.number.length < 12 || !card.name)) return toast.error('Fill card details');
    setProcessing(true);
    // MOCK: real Razorpay integration will replace this once keys are provided
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      const receipt = { ...donation, method, txnId: 'MAD' + Math.random().toString(36).slice(2, 10).toUpperCase(), status: 'success' };
      const list = JSON.parse(localStorage.getItem('mad_donations') || '[]');
      list.unshift(receipt);
      localStorage.setItem('mad_donations', JSON.stringify(list));
      localStorage.removeItem('mad_pending_donation');
      toast.success('Payment successful (demo mode)');
    }, 1600);
  };
  const copyUpi = () => {
  navigator.clipboard.writeText(upiId);
  toast.success("UPI ID copied");
};

const openUpiApp = () => {
  window.location.href = upiLink;
};

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#2F6E5B] text-white mx-auto flex items-center justify-center"><Check size={30} strokeWidth={2.5} /></div>
        <h1 className="font-serif text-4xl mt-6">Thank you, {donation.donor.name.split(' ')[0]}.</h1>
        <p className="font-serif italic text-[19px] text-[#4a4a44] mt-3">Your {formatINR(donation.amount)} just reached the right hands.</p>
        <div className="mt-8 bg-white border border-[#E7DFCF] rounded-lg p-6 text-left">
          <div className="flex justify-between text-[13px] py-1"><span className="text-[#4a4a44]">Campaign</span><span className="font-medium">{donation.campaignTitle}</span></div>
          <div className="flex justify-between text-[13px] py-1"><span className="text-[#4a4a44]">Amount</span><span className="font-semibold">{formatINR(donation.amount)}</span></div>
          <div className="flex justify-between text-[13px] py-1"><span className="text-[#4a4a44]">Method</span><span>{method.toUpperCase()}</span></div>
          <div className="flex justify-between text-[13px] py-1"><span className="text-[#4a4a44]">Transaction ID</span><span className="font-mono text-[12px]">MAD-DEMO-{Date.now().toString().slice(-8)}</span></div>
        </div>
        <p className="text-[13px] text-[#4a4a44] mt-6">An 80G tax receipt has been emailed to {donation.donor.email} (demo).</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/all-causes" className="btn-orange">Support another cause</Link>
          <Link to="/" className="btn-outline-ink">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <div className="section-eyebrow mb-1">Complete your donation</div>
          <h1 className="font-serif text-3xl md:text-4xl">Choose your payment method.</h1>
          <p className="text-[13.5px] text-[#4a4a44] mt-2">All payments are secured by 256-bit encryption. Razorpay integration will activate once API keys are provided.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {METHODS.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} className={`p-4 rounded-lg border text-left transition ${method === m.id ? 'border-[#EF6A3D] bg-[#FDECE4]' : 'border-[#E7DFCF] bg-white hover:border-[#a89b83]'}`}>
              <m.icon size={22} className={method === m.id ? 'text-[#EF6A3D]' : 'text-[#4a4a44]'} strokeWidth={1.7} />
              <div className="font-semibold text-[14px] mt-2">{m.label}</div>
              <div className="text-[11.5px] text-[#4a4a44]">{m.sub}</div>
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#E7DFCF] rounded-lg p-6">
       {method === 'upi' && (
  <div className="space-y-5">

    <div className="font-serif text-xl font-medium">
      Choose your UPI App
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

      {[
        "Google Pay",
        "PhonePe",
        "BHIM UPI",
        "Paytm",
        "Amazon Pay"
      ].map((app) => (

        <button
          key={app}
          onClick={() => setSelectedApp(app)}
          className={`border rounded-lg p-4 transition-all ${
            selectedApp === app
              ? "border-[#EF6A3D] bg-[#FFF4EF]"
              : "border-[#E7DFCF]"
          }`}
        >
          <div className="font-semibold">
            {app}
          </div>
        </button>

      ))}

    </div>

    <div className="flex justify-center mt-6">

      <div className="bg-white p-4 rounded-lg border border-[#E7DFCF]">

        <QRCode
          value={upiLink}
          size={180}
        />

      </div>

    </div>

    <div className="text-center">

      <div className="font-semibold">
        UPI ID
      </div>

      <div className="text-[#EF6A3D]">
        {upiId}
      </div>

    </div>

    <div className="flex gap-3">

      <button
        onClick={copyUpi}
        className="btn-outline-ink flex-1 justify-center"
      >
        <Copy size={16} />
        Copy UPI
      </button>

      <button
        onClick={openUpiApp}
        className="btn-orange flex-1 justify-center"
      >
        <ExternalLink size={16} />
        Open App
      </button>

    </div>

  </div>
)}
          {method === 'card' && (
            <div className="space-y-3">
              <div className="font-serif text-lg font-medium">Card details</div>
              <input value={card.number} onChange={e => setCard({...card, number: e.target.value.replace(/\D/g, '').slice(0,16)})} placeholder="Card number" className="w-full px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D] tracking-widest" />
              <input value={card.name} onChange={e => setCard({...card, name: e.target.value})} placeholder="Cardholder name" className="w-full px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D]" />
              <div className="grid grid-cols-2 gap-3">
                <input value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} placeholder="MM/YY" className="px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D]" />
                <input value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g,'').slice(0,4)})} placeholder="CVV" type="password" className="px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D]" />
              </div>
            </div>
          )}
          {method === 'netbanking' && (
            <div>
              <div className="font-serif text-lg font-medium mb-3">Choose your bank</div>
              <div className="grid grid-cols-3 gap-2">
                {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'IndusInd', 'Yes Bank', 'IDFC First', 'PNB'].map(b => (
                  <button key={b} className="py-2.5 border border-[#E7DFCF] rounded-md text-[13px] hover:border-[#EF6A3D] hover:bg-[#FDECE4]">{b}</button>
                ))}
              </div>
            </div>
          )}
          {method === 'wallet' && (
            <div>
              <div className="font-serif text-lg font-medium mb-3">Choose a wallet</div>
              <div className="grid grid-cols-3 gap-2">
                {['Paytm', 'Amazon Pay', 'Mobikwik', 'Airtel', 'Freecharge', 'JioMoney'].map(b => (
                  <button key={b} className="py-2.5 border border-[#E7DFCF] rounded-md text-[13px] hover:border-[#EF6A3D] hover:bg-[#FDECE4]">{b}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <aside>
        <div className="bg-white border border-[#E7DFCF] rounded-lg p-6 sticky top-24">
          <div className="font-serif text-xl font-medium">Order summary</div>
          <div className="mt-3 text-[13px] text-[#4a4a44]">You are donating to</div>
          <div className="font-serif text-[15px] font-medium mt-1 leading-snug">{donation.campaignTitle}</div>
          <div className="h-px bg-[#E7DFCF] my-4" />
          <div className="flex justify-between text-[14px]"><span className="text-[#4a4a44]">Amount</span><span className="font-semibold">{formatINR(donation.amount)}</span></div>
          <div className="flex justify-between text-[14px] mt-2"><span className="text-[#4a4a44]">Processing fee</span><span>₹0</span></div>
          <div className="h-px bg-[#E7DFCF] my-4" />
          <div className="flex justify-between"><span className="font-semibold">Total payable</span><span className="font-serif text-2xl font-medium">{formatINR(donation.amount)}</span></div>
          <button onClick={pay} disabled={processing} className="btn-orange w-full justify-center mt-6 !py-3 disabled:opacity-70">{processing ? 'Processing...' : `Pay ${formatINR(donation.amount)}`}</button>
          <div className="flex items-center gap-2 mt-4 text-[11.5px] text-[#2F6E5B] font-semibold"><ShieldCheck size={14} /> 256-bit encrypted • PCI-DSS L1</div>
          <p className="text-[11px] text-[#4a4a44] mt-2">Demo mode: real payment will be enabled once Razorpay keys are configured.</p>
        </div>
      </aside>
    </div>
  );
}
