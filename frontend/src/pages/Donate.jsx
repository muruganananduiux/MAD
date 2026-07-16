import React, { useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CAMPAIGNS, formatINR } from '@/data';
import {
  ShieldCheck,
  ArrowRight,
  Heart,
  Share2
} from 'lucide-react';


import { toast } from 'sonner';

export default function Donate() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const campaign = useMemo(() => CAMPAIGNS.find(c => c.id === id) || CAMPAIGNS[0], [id]);
  const [amt, setAmt] = useState(Number(params.get('amt')) || 1000);
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', pan: '', anonymous: false, message: '' });
  const [tip, setTip] = useState(30);

  const total = amt + Math.round((amt * tip) / 100 * 0.02) * 50; // decorative tip calc

  const proceed = () => {
    if (amt < 100) return toast.error('Minimum donation is ₹100');
    if (!donor.name || !donor.email) return toast.error('Please fill name and email');
    const payload = { campaignId: campaign.id, campaignTitle: campaign.title, amount: amt, donor, timestamp: Date.now() };
    localStorage.setItem('mad_pending_donation', JSON.stringify(payload));
    nav('/payment');
  };

  const shareCampaign = async () => {
  const shareUrl = `${window.location.origin}/campaign/${campaign.id}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: campaign.title,
        text: `Support this campaign: ${campaign.title}`,
        url: shareUrl,
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  } else {
    navigator.clipboard.writeText(shareUrl);
    alert("Campaign link copied!");
  }
};
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <div className="section-eyebrow mb-2">You’re supporting</div>
          <div className="flex gap-4 bg-white border border-[#E7DFCF] rounded-lg p-4 items-center">
            <img src={campaign.image} className="w-24 h-24 object-cover rounded" alt="" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-[#EF6A3D] font-bold">{campaign.cause}</div>
              <div className="font-serif text-[18px] font-medium leading-snug">{campaign.title}</div>
              <div className="text-[12px] text-[#4a4a44] mt-1">For {campaign.beneficiary}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFCF] rounded-lg p-6">
          <div className="font-serif text-xl font-medium mb-4">Choose your contribution</div>
          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 2500, 5000, 10000, 25000].map(v => (
              <button key={v} onClick={() => setAmt(v)} className={`py-2.5 rounded-full text-[13px] font-semibold border transition ${amt === v ? 'border-[#EF6A3D] bg-[#FDECE4] text-[#EF6A3D]' : 'border-[#E7DFCF] hover:border-[#a89b83]'}`}>₹{v.toLocaleString()}</button>
            ))}
          </div>
          <div className="mt-3">
            <input value={amt} onChange={e => setAmt(Number(e.target.value) || 0)} type="number" className="w-full px-4 py-3 border border-[#E7DFCF] rounded-md bg-white text-[15px] focus:outline-none focus:border-[#EF6A3D]" placeholder="Enter custom amount" />
          </div>

          <div className="mt-6 p-4 bg-[#F3EBDD] rounded-lg">
            <div className="flex justify-between items-center text-[13px]"><span className="font-medium">Support MAD (optional)</span><span className="text-[#4a4a44]">Helps us stay free for beneficiaries</span></div>
            <div className="flex gap-2 mt-3">
              {[0, 5, 10, 15, 30].map(t => (
                <button key={t} onClick={() => setTip(t)} className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold border ${tip === t ? 'border-[#EF6A3D] bg-white text-[#EF6A3D]' : 'border-transparent bg-white/60'}`}>{t === 0 ? 'No thanks' : t + '%'}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFCF] rounded-lg p-6">
          <div className="font-serif text-xl font-medium mb-4">Your details</div>
          <div className="grid md:grid-cols-2 gap-3">
            <input value={donor.name} onChange={e => setDonor({...donor, name: e.target.value})} placeholder="Full name*" className="px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
            <input value={donor.email} onChange={e => setDonor({...donor, email: e.target.value})} type="email" placeholder="Email*" className="px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
            <input value={donor.phone} onChange={e => setDonor({...donor, phone: e.target.value})} placeholder="Phone" className="px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
            <input value={donor.pan} onChange={e => setDonor({...donor, pan: e.target.value.toUpperCase()})} placeholder="PAN (for 80G receipt)" className="px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
          </div>
          <textarea value={donor.message} onChange={e => setDonor({...donor, message: e.target.value})} placeholder="Leave a message of support (optional)" rows={2} className="w-full mt-3 px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
          <label className="flex items-center gap-2 mt-3 text-[13px] text-[#4a4a44]">
            <input type="checkbox" checked={donor.anonymous} onChange={e => setDonor({...donor, anonymous: e.target.checked})} /> Donate anonymously
          </label>
        </div>
      </div>

      <aside>
        <div className="bg-white border border-[#E7DFCF] rounded-lg p-6 sticky top-24">
          <div className="font-serif text-xl font-medium">Summary</div>
          <div className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between"><span className="text-[#4a4a44]">Your contribution</span><span className="font-semibold">{formatINR(amt)}</span></div>
            <div className="flex justify-between"><span className="text-[#4a4a44]">Platform support</span><span>{tip === 0 ? '—' : `${tip}%`}</span></div>
            <div className="h-px bg-[#E7DFCF] my-2" />
            <div className="flex justify-between text-[16px]"><span className="font-semibold">Total</span><span className="font-serif text-xl">{formatINR(amt + Math.round(amt * tip / 100))}</span></div>
          </div>
          <button onClick={proceed} className="btn-orange w-full justify-center mt-6 !py-3"><Heart size={16} /> Proceed to Payment <ArrowRight size={16} /></button>
          <button
  onClick={shareCampaign}
  className="btn-outline-ink w-full justify-center mt-2 !py-2.5"
>
  <Share2 size={15} />
  Share Campaign
</button>
          <div className="flex items-center gap-2 mt-4 text-[11.5px] text-[#2F6E5B] font-semibold"><ShieldCheck size={14} /> Bank-grade encrypted • PCI-DSS Level 1</div>
          <div className="text-[11px] text-[#4a4a44] mt-1">80G receipt emailed instantly after payment.</div>
        </div>
      </aside>
    </div>
  );
}
