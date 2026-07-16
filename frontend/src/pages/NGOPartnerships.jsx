import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { IMAGES } from '@/data';
import { BadgeCheck, Handshake, LineChart, Users } from 'lucide-react';

const PARTNERS = ['Akshaya Patra', 'Smile Foundation', 'Goonj', 'CRY India', 'HelpAge India', 'Teach For India', 'Give India Trust', 'Pratham Books'];

export default function NGOPartnerships() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader eyebrow="NGO Partnerships" title="For nonprofits that put" italic="impact before optics." subtitle="312 verified NGOs raise sustained funding through MAD. Join a network built for grassroots outcomes." image={IMAGES.ruralFamily3} />
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-6">
        {[
          { icon: Users, t: '21 Lakh+ donor base', d: 'Direct access to India’s most active giving community.' },
          { icon: BadgeCheck, t: 'Verification badge', d: 'Once verified, your campaigns rank higher and earn donor trust.' },
          { icon: LineChart, t: 'Growth analytics', d: 'Dashboards for donor retention, drop-off and cause performance.' },
          { icon: Handshake, t: 'Zero platform fee', d: 'For all 12A / 80G registered NGOs on annual partnerships.' },
        ].map(x => (
          <div key={x.t} className="p-6 bg-white border border-[#E7DFCF] rounded-lg">
            <x.icon size={26} className="text-[#EF6A3D]" strokeWidth={1.6} />
            <div className="font-serif text-lg mt-3 font-medium">{x.t}</div>
            <p className="text-[13.5px] text-[#4a4a44] mt-2 leading-relaxed">{x.d}</p>
          </div>
        ))}
      </section>
      <section className="bg-[#F3EBDD] border-y border-[#E7DFCF]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="section-eyebrow mb-3">Some of our partners</div>
          <h2 className="font-serif text-3xl md:text-4xl">Trusted by nonprofits large & small.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {PARTNERS.map(p => (
              <div key={p} className="bg-white border border-[#E7DFCF] rounded p-5 text-center font-serif italic text-[#4a4a44]">{p}</div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="btn-orange" onClick={() => nav('/help')}>Apply to become a partner</button>
          </div>
        </div>
      </section>
    </div>
  );
}
