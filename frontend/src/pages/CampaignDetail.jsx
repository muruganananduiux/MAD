import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CAMPAIGNS, formatINR } from '@/data';
import { Share2, Heart, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const c = CAMPAIGNS.find(x => x.id === id);
  const [amt, setAmt] = useState(1000);
  if (!c) return <div className="max-w-4xl mx-auto px-6 py-20">Campaign not found. <Link to="/all-causes" className="link-underline">See all campaigns</Link></div>;
  const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));

  const share = () => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied to clipboard'); };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-[12px] text-[#4a4a44] mb-4"><Link to="/all-causes" className="hover:text-[#EF6A3D]">All Causes</Link> / <span className="text-[#14140F]">{c.cause}</span></div>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <img src={c.image} alt="" className="w-full h-[380px] object-cover rounded-lg" />
          <div className="text-[10px] uppercase tracking-[0.14em] text-[#EF6A3D] font-bold mt-6">{c.cause}</div>
          <h1 className="font-serif text-3xl md:text-4xl mt-2 leading-tight">{c.title}</h1>
          <div className="text-[13px] text-[#4a4a44] mt-2">For {c.beneficiary}</div>
          <div className="flex items-center gap-2 mt-4 text-[12px] text-[#2F6E5B] font-semibold"><ShieldCheck size={14} /> Verified by MAD Trust Team</div>

          <div className="mt-8 space-y-4 text-[15px] text-[#333] leading-relaxed">
            <p>{c.story}</p>
            <p>Every rupee raised on this campaign is transferred directly to the verified beneficiary account. Milestone-based utilisation reports and hospital invoices are uploaded weekly. Once the goal is met, campaigns close automatically.</p>
            <p>Thank you for reading this far. Even a small contribution or share can help push this campaign to the finish line.</p>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white border border-[#E7DFCF] rounded-lg p-6 sticky top-24">
            <div className="progress-track"><div className="progress-fill" style={{width: `${pct}%`}} /></div>
            <div className="flex justify-between mt-3">
              <div><div className="font-serif text-2xl font-semibold">{formatINR(c.raised)}</div><div className="text-[11px] text-[#4a4a44] uppercase tracking-widest">raised</div></div>
              <div className="text-right"><div className="font-serif text-2xl font-semibold">{formatINR(c.goal)}</div><div className="text-[11px] text-[#4a4a44] uppercase tracking-widest">goal</div></div>
            </div>

            <div className="mt-5">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#4a4a44] mb-2">Choose amount</div>
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map(v => (
                  <button key={v} onClick={() => setAmt(v)} className={`py-2 rounded-full text-[13px] font-semibold border transition ${amt === v ? 'border-[#EF6A3D] bg-[#FDECE4] text-[#EF6A3D]' : 'border-[#E7DFCF] bg-white hover:border-[#a89b83]'}`}>₹{v}</button>
                ))}
              </div>
              <input value={amt} onChange={e => setAmt(Number(e.target.value) || 0)} type="number" className="w-full mt-3 px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
            </div>

            <button onClick={() => nav(`/donate/${c.id}?amt=${amt}`)} className="btn-orange w-full justify-center mt-4 !py-3"><Heart size={16} /> Donate Now</button>
            <button onClick={share} className="btn-outline-ink w-full justify-center mt-2 !py-2.5"><Share2 size={15} /> Share</button>
            <div className="text-[11px] text-[#4a4a44] text-center mt-4">80G tax exemption applicable • Instant receipt</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
