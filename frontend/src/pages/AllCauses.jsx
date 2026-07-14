import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { CAMPAIGNS, CAUSES, formatINR, IMAGES } from '@/data';
import { Search, Share2 } from 'lucide-react';

export default function AllCauses() {
  const [params] = useSearchParams();
  const preset = params.get('cause');
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState(preset || 'all');

  

  const filtered = useMemo(() => {
    return CAMPAIGNS.filter(c => {
      const cs = CAUSES.find(x => x.name === c.cause || x.slug === filter);
      const causeMatch = filter === 'all' || (cs && (cs.name === c.cause));
      const qMatch = c.title.toLowerCase().includes(q.toLowerCase());
      return causeMatch && qMatch;
    });
  }, [q, filter]);

  return (
    <div>
      <PageHeader eyebrow="All Causes" title="Find a fundraiser" italic="worth your Sunday." subtitle="Search by cause, story or region. Every campaign here is verified and live right now." image={IMAGES.ruralFamily2} />
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89b83]" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search campaigns..." className="w-full pl-11 pr-4 py-3 border border-[#E7DFCF] rounded-full bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-5 py-3 border border-[#E7DFCF] rounded-full bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]">
            <option value="all">All causes</option>
            {CAUSES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#4a4a44]">No campaigns match your filters.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(c => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
              return (
                <Link key={c.id} to={`/campaign/${c.id}`} className="campaign-card">
                  <img src={c.image} alt="" className="w-full h-48 object-cover" />
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#EF6A3D] font-bold">{c.cause}</div>
                    <div className="font-serif text-[17px] font-medium mt-1.5 leading-snug">{c.title}</div>
                    <div className="mt-auto pt-5">
                      <div className="progress-track"><div className="progress-fill" style={{width: `${pct}%`}} /></div>
                      <div className="flex justify-between mt-2 text-[12px] text-[#4a4a44]">
                        <span><span className="font-semibold text-[#14140F]">{formatINR(c.raised)}</span> raised</span>
                        <span>of {formatINR(c.goal)}</span>
                      </div>
                      <button className="btn-orange w-full justify-center mt-4 !py-2.5" onClick={(e) => { e.preventDefault(); nav(`/donate/${c.id}`); }}>Donate Now</button>
                      <button
  className="btn-outline-ink w-full justify-center mt-2 !py-2.5"
  onClick={(e) => shareCampaign(e, c)}
>
  <Share2 size={15} />
  Share
</button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
