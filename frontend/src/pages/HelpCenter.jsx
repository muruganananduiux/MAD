import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { FAQS, IMAGES } from '@/data';
import { ChevronDown, LifeBuoy, Mail, MessageCircle } from 'lucide-react';

export default function HelpCenter() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <PageHeader eyebrow="Help Center" title="Answers to the questions" italic="you have not asked yet." subtitle="If you cannot find what you are looking for, our support team responds within 4 hours — no chatbots." image={IMAGES.edu2} />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="section-eyebrow mb-3">Frequently asked</div>
        <div className="divide-y divide-[#E7DFCF] border-y border-[#E7DFCF]">
          {FAQS.map((f, i) => (
            <button key={f.q} onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left py-5 flex items-start gap-4">
              <div className="flex-1">
                <div className="font-serif text-[18px] font-medium">{f.q}</div>
                {open === i && <p className="text-[14px] text-[#4a4a44] mt-3 leading-relaxed">{f.a}</p>}
              </div>
              <ChevronDown size={20} className={`transition ${open === i ? 'rotate-180 text-[#EF6A3D]' : 'text-[#4a4a44]'}`} />
            </button>
          ))}
        </div>
      </section>
      <section className="bg-[#F3EBDD] border-y border-[#E7DFCF]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: MessageCircle, t: 'Live chat', d: 'Mon–Sat, 9am–10pm IST', c: 'Start chat' },
            { icon: Mail, t: 'Email', d: 'support@mad.example', c: 'Email us' },
            { icon: LifeBuoy, t: 'Report an issue', d: 'Trust & safety within 4 hrs', c: 'Report now' },
          ].map(x => (
            <div key={x.t} className="p-6 bg-white border border-[#E7DFCF] rounded-lg">
              <x.icon size={26} className="text-[#EF6A3D]" strokeWidth={1.6} />
              <div className="font-serif text-xl mt-3 font-medium">{x.t}</div>
              <p className="text-[13px] text-[#4a4a44] mt-1">{x.d}</p>
              <button className="btn-outline-ink mt-4 !py-2 !px-4 text-[12px]">{x.c}</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
