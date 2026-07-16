import React from 'react';
import PageHeader from '../components/PageHeader';
import { IMPACT_NUMBERS, IMAGES, STORIES } from '@/data';
import { Link } from 'react-router-dom';

export default function OurImpact() {
  return (
    <div>
      <PageHeader eyebrow="Our Impact" title="Numbers that hide" italic="a million faces." subtitle="Every metric here is a family fed, a surgery paid for, a school reopened. We publish the full impact ledger every quarter." image={IMAGES.charity1} />
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {IMPACT_NUMBERS.map(i => (
          <div key={i.label} className="border-t border-[#E7DFCF] pt-6">
            <div className="font-serif text-5xl text-[#EF6A3D] font-medium">{i.value}</div>
            <div className="text-[13px] uppercase tracking-[0.14em] text-[#4a4a44] mt-2">{i.label}</div>
          </div>
        ))}
      </section>
      <section className="bg-[#2F6E5B] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="section-eyebrow !text-[#F3B58C] mb-3">Latest updates</div>
          <h2 className="font-serif text-3xl md:text-4xl">Where your rupees went last month.</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-10">
            {STORIES.map(s => (
              <Link key={s.id} to="/stories" className="group bg-white/5 rounded-lg overflow-hidden border border-white/10">
                <img src={s.image} alt="" className="w-full h-40 object-cover group-hover:scale-105 transition duration-500" />
                <div className="p-4">
                  <div className="text-[10px] tracking-[0.14em] uppercase text-white/70">{s.date}</div>
                  <div className="font-serif text-[15px] mt-1 leading-snug">{s.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
