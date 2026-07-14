import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATS, CAUSES, HOW_STEPS, WAYS_TO_GIVE, CAMPAIGNS, IMAGES, formatINR } from '@/data';
import { Play, ArrowRight, Stethoscope, GraduationCap, CloudRain, Building2, PawPrint, Trees, Trophy, HandHeart, ShieldCheck, Landmark, BadgeIndianRupee, Timer } from 'lucide-react';

const CauseIcon = ({ slug, className }) => {
  const map = {
    medical: Stethoscope, education: GraduationCap, disaster: CloudRain,
    ngo: Building2, animal: PawPrint, environment: Trees, sports: Trophy, community: HandHeart,
  };
  const Icon = map[slug] || HandHeart;
  return <Icon className={className} strokeWidth={1.7} />;
};

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative w-full h-[480px] md:h-[560px] overflow-hidden bg-black">
          <img src="/images/pexels-themeditators-12181163.jpg" alt="hope" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-14 max-w-2xl text-white fade-up">
              <div className="text-[11px] tracking-[0.22em] text-[#F3B58C] font-semibold uppercase mb-4">MAD by TSA — Trusted giving. Verified impact.</div>
              <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] font-medium">
                Small acts add up<br/>to a <span className="italic text-[#F3B58C]">big difference.</span>
              </h1>
              <p className="mt-5 text-[15px] text-white/85 max-w-lg leading-relaxed">
                Verified fundraisers, transparent fund transfers and 80G tax benefits — built for society who want their generosity to count, not just circulate.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => navigate('/start-fundraiser')} className="btn-orange">Start a Fundraiser <ArrowRight size={16} /></button>
                <button onClick={() => navigate('/all-causes')} className="bg-white text-[#14140F] px-5 py-3 rounded-full font-semibold text-sm hover:bg-white/90 transition">Donate to a Cause</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#2F6E5B] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-4xl md:text-5xl font-medium">{s.value}</div>
              <div className="text-[12px] uppercase tracking-[0.14em] mt-1 text-white/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CAUSES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="section-eyebrow mb-4">Where your giving goes</div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight max-w-2xl">Eight causes. One promise —<br/>every campaign is <span className="italic">verified.</span></h2>
            <p className="mt-4 text-[15px] text-[#4a4a44] max-w-2xl">From a hospital bill due tonight to a school that needs a roof — choose a cause close to your heart and follow it all the way to impact.</p>
          </div>
          <Link to="/causes" className="btn-outline-ink !py-2 !px-5 text-[13px]">Explore all causes →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-10">
          {CAUSES.map(c => (
            <Link key={c.id} to={`/all-causes?cause=${c.slug}`} className="cause-tile group">
              <img src={c.image} alt={c.name} className="cause-tile__img" loading="lazy" />
              <div className="cause-tile__overlay" />
              <div className="cause-tile__body">
                <div className="flex items-start justify-between">
                  <span className="cause-tile__num">{c.id}</span>
                  <span className="cause-tile__icon">
                    <CauseIcon slug={c.slug} className="w-[18px] h-[18px] text-white" />
                  </span>
                </div>
                <div>
                  <div className="cause-tile__meta">{c.count}</div>
                  <div className="cause-tile__title mt-1">{c.name}</div>
                  <div className="cause-tile__arrow">Donate now <ArrowRight size={13} /></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-[#E7DFCF] bg-[#F3EBDD]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-around gap-4 text-[12px] font-semibold text-[#14140F]">
          {['100% Verified Fundraisers', 'Bank-Grade Secure Payments', '80G & 12A Tax Exemption', 'Zero-Fee Giving Available', 'Funds Reach Within 24 Hrs'].map(t => (
            <div key={t} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#EF6A3D]" /> {t}</div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="section-eyebrow mb-4">How MAD works</div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight max-w-2xl">From your story to their support,<br/>in three <span className="italic">steps.</span></h2>
        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {HOW_STEPS.map(s => (
            <div key={s.num} className="border-t border-[#E7DFCF] pt-6">
              <div className="font-serif italic text-[#EF6A3D] text-4xl">{s.num}</div>
              <div className="font-serif text-xl mt-3 font-medium">{s.title}</div>
              <p className="mt-3 text-[14px] text-[#4a4a44] leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WAYS TO GIVE */}
      <section className="bg-[#F3EBDD] border-y border-[#E7DFCF]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="section-eyebrow mb-4">Ways to Give</div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight max-w-2xl">Giving that fits how you already <span className="italic">live.</span></h2>
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {WAYS_TO_GIVE.map(w => (
              <div key={w.title} className="border-t border-[#14140F]/20 pt-5">
                <div className="font-serif text-[19px] font-medium leading-snug">{w.title}</div>
                <p className="mt-3 text-[13.5px] text-[#4a4a44] leading-relaxed">{w.text}</p>
                <Link to="/ways-to-give" className="link-underline text-[13px] mt-4 inline-block">{w.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE FUNDRAISERS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="section-eyebrow mb-4">Live right now</div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight max-w-2xl">Fundraisers waiting for one more <span className="italic">hand.</span></h2>
          </div>
          <Link to="/live-campaigns" className="btn-outline-ink !py-2 !px-5 text-[13px]">View All Campaigns</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {CAMPAIGNS.slice(0, 3).map(c => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <Link key={c.id} to={`/campaign/${c.id}`} className="campaign-card">
                <img src={c.image} alt={c.title} className="w-full h-52 object-cover" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#EF6A3D] font-bold">{c.cause}</div>
                  <div className="font-serif text-[18px] font-medium mt-1.5 leading-snug">{c.title}</div>
                  <div className="mt-auto pt-5">
                    <div className="progress-track"><div className="progress-fill" style={{width: `${pct}%`}} /></div>
                    <div className="flex justify-between mt-2 text-[12px] text-[#4a4a44]">
                      <span><span className="font-semibold text-[#14140F]">{formatINR(c.raised)}</span> raised</span>
                      <span>of {formatINR(c.goal)}</span>
                    </div>
                    <button className="btn-orange w-full justify-center mt-4 !py-2.5" onClick={(e) => { e.preventDefault(); navigate(`/donate/${c.id}`); }}>Donate Now</button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FILM STRIP */}
      <section className="relative">
        <img src={IMAGES.heroChild2} alt="story" className="w-full h-[440px] object-cover object-center hero-image" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <button className="absolute inset-0 flex items-center justify-center" onClick={() => navigate('/stories')}>
          <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg hover:scale-105 transition">
            <Play size={22} className="text-[#14140F] ml-1" fill="#14140F" />
          </span>
        </button>
        <div className="absolute bottom-10 left-8 md:left-14 right-8 text-white max-w-3xl">
          <div className="text-[11px] tracking-[0.22em] text-[#F3B58C] font-semibold uppercase mb-3">A film about second chances</div>
          <p className="font-serif italic text-2xl md:text-3xl leading-snug">
            “I didn’t ask 400 people to save my daughter. I asked once — and MAD made sure it reached them.”
          </p>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-[#EF6A3D] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h3 className="font-serif text-3xl md:text-4xl">Ready to make a <span className="italic">difference?</span></h3>
          <p className="mt-3 text-[14.5px] text-white/90 max-w-xl mx-auto">Whether you’re raising funds or giving them — your next click helps lives that five minutes.</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate('/start-fundraiser')} className="bg-white text-[#14140F] px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/90 transition">Start a Fundraiser</button>
            <button onClick={() => navigate('/all-causes')} className="border border-white/90 px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition">Donate to a Cause</button>
          </div>
        </div>
      </section>
    </div>
  );
}
