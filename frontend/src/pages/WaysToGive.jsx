import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { WAYS_TO_GIVE, IMAGES } from '@/data';
import { Repeat, Building, Package, Heart } from 'lucide-react';

const ICONS = [Heart, Building, Package, Repeat];

export default function WaysToGive() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader eyebrow="Ways to Give" title="Give the way that" italic="suits you." subtitle="One-time, monthly, in someone’s memory, or a company-wide CSR programme — pick a rhythm that stays." image={IMAGES.charity4} />
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8">
        {WAYS_TO_GIVE.map((w, i) => {
          const Icon = ICONS[i];
          return (
            <div key={w.title} className="bg-white border border-[#E7DFCF] rounded-lg p-8 hover:shadow-lg transition">
              <Icon size={28} strokeWidth={1.6} className="text-[#EF6A3D]" />
              <div className="font-serif text-2xl mt-4 font-medium">{w.title}</div>
              <p className="text-[14.5px] text-[#4a4a44] mt-3 leading-relaxed">{w.text}</p>
              <button className="btn-orange mt-6" onClick={() => nav('/all-causes')}>{w.cta}</button>
            </div>
          );
        })}
      </section>

      <section className="bg-[#2F6E5B] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="text-[11px] tracking-[0.22em] uppercase text-[#F3B58C] font-semibold">Monthly Giving Circle</div>
            <h3 className="font-serif text-3xl md:text-4xl mt-3">₹500 a month funds a child’s cancer medication line for life.</h3>
          </div>
          <button onClick={() => nav('/donate')} className="btn-orange justify-self-start md:justify-self-end">Give Monthly</button>
        </div>
      </section>
    </div>
  );
}
