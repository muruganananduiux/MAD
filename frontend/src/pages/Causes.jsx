import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { CAUSES, IMAGES } from '@/data';
import { Stethoscope, GraduationCap, CloudRain, Building2, PawPrint, Trees, Trophy, HandHeart, ArrowRight } from 'lucide-react';

const ICONS = { medical: Stethoscope, education: GraduationCap, disaster: CloudRain, ngo: Building2, animal: PawPrint, environment: Trees, sports: Trophy, community: HandHeart };

export default function Causes() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader eyebrow="Causes on MAD" title="Eight causes." italic="One promise." subtitle="Every campaign on MAD is verified end-to-end. Choose a cause, meet the beneficiary, follow every rupee." image={IMAGES.charity1} />
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAUSES.map(c => {
          const Icon = ICONS[c.slug] || HandHeart;
          return (
            <div key={c.id} className="p-8 border border-[#E7DFCF] rounded-lg bg-white flex flex-col hover:shadow-lg transition">
              <Icon size={30} strokeWidth={1.6} className="text-[#EF6A3D]" />
              <div className="font-serif text-xl mt-4 font-medium">{c.name}</div>
              <p className="text-[14px] text-[#4a4a44] mt-2 leading-relaxed flex-1">{c.description}</p>
              <div className="flex gap-2 mt-6">
                <Link to={`/all-causes?cause=${c.slug}`} className="link-underline text-[13px]">View campaigns →</Link>
              </div>
            </div>
          );
        })}
      </section>
      <section className="bg-[#2F6E5B] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="font-serif text-3xl md:text-4xl">Not sure which cause fits you?</h3>
          <p className="mt-3 text-white/85 max-w-xl mx-auto text-[14.5px]">Answer 3 quick questions and we’ll show you fundraisers your values align with.</p>
          <button onClick={() => nav('/all-causes')} className="btn-orange mt-6">Explore all campaigns <ArrowRight size={16} /></button>
        </div>
      </section>
    </div>
  );
}
