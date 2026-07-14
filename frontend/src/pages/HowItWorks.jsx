import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { HOW_STEPS, IMAGES } from '@/data';
import { ShieldCheck, Wallet, Users, FileCheck2 } from 'lucide-react';

export default function HowItWorks() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader eyebrow="How it works" title="From your story" italic="to their support." subtitle="MAD strips fundraising down to what actually matters — verified stories, safe payments, and money that reaches the right hands in 24 hours." image={IMAGES.ruralFamily1} />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          {HOW_STEPS.map(s => (
            <div key={s.num} className="border-t border-[#E7DFCF] pt-6">
              <div className="font-serif italic text-[#EF6A3D] text-5xl">{s.num}</div>
              <div className="font-serif text-2xl mt-3 font-medium">{s.title}</div>
              <p className="mt-3 text-[14px] text-[#4a4a44] leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F3EBDD] border-y border-[#E7DFCF]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="section-eyebrow mb-4">Behind every campaign</div>
          <h2 className="font-serif text-3xl md:text-4xl max-w-2xl">Four checks before a rupee is <span className="italic">raised.</span></h2>
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              { icon: FileCheck2, title: 'Document verification', text: 'PAN, Aadhaar, medical bills or NGO registration — every claim is cross-checked.' },
              { icon: Users, title: 'Beneficiary contact', text: 'We speak to the beneficiary directly, in their language, before going live.' },
              { icon: ShieldCheck, title: 'Risk & fraud scan', text: 'AI + manual review catches duplicate campaigns and suspicious patterns.' },
              { icon: Wallet, title: 'Escrowed payouts', text: 'Funds sit in a regulated escrow account. Nothing moves without milestone proof.' },
            ].map(x => (
              <div key={x.title} className="bg-white border border-[#E7DFCF] rounded-lg p-6">
                <x.icon size={26} className="text-[#EF6A3D]" strokeWidth={1.7} />
                <div className="font-serif text-lg mt-3 font-medium">{x.title}</div>
                <p className="text-[13.5px] text-[#4a4a44] mt-2 leading-relaxed">{x.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h3 className="font-serif text-3xl md:text-4xl">Ready to start yours?</h3>
        <button onClick={() => nav('/start-fundraiser')} className="btn-orange mt-6">Start a Fundraiser</button>
      </section>
    </div>
  );
}
