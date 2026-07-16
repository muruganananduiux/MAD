import React from 'react';
import PageHeader from '../components/PageHeader';
import { IMAGES } from '@/data';
import { ShieldCheck, Lock, FileText, Eye, Landmark, BadgeCheck } from 'lucide-react';

const PILLARS = [
  { icon: BadgeCheck, title: 'Verified Fundraisers', text: 'Every campaign passes ID, medical, and beneficiary contact checks before it goes live.' },
  { icon: Landmark, title: 'Regulated Escrow', text: 'Funds are held in an RBI-regulated escrow, released only against verified milestones.' },
  { icon: Lock, title: 'PCI-DSS Payments', text: 'Card and UPI data never touch our servers. We use PCI-DSS Level 1 certified gateways.' },
  { icon: Eye, title: 'Radical Transparency', text: 'Utilisation reports, invoice uploads, and outcome updates for every rupee raised.' },
  { icon: FileText, title: '80G / 12A Compliant', text: 'Instant tax receipts for eligible donations — downloadable from your dashboard.' },
  { icon: ShieldCheck, title: 'Zero-Tolerance Fraud Policy', text: 'AI-assisted detection + a 4-member trust council review suspicious activity daily.' },
];

export default function TrustSafety() {
  return (
    <div>
      <PageHeader eyebrow="Trust & Safety" title="Built for donors who" italic="want proof, not promises." subtitle="MAD spends more on verification than on marketing. That is why 98% of every rupee reaches the beneficiary." image={IMAGES.charity2} />
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {PILLARS.map(p => (
          <div key={p.title} className="bg-white border border-[#E7DFCF] rounded-lg p-6">
            <p.icon size={28} className="text-[#EF6A3D]" strokeWidth={1.6} />
            <div className="font-serif text-xl mt-4 font-medium">{p.title}</div>
            <p className="text-[13.5px] text-[#4a4a44] mt-2 leading-relaxed">{p.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-[#F3EBDD] border-y border-[#E7DFCF]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="section-eyebrow mb-3">Report a concern</div>
          <h3 className="font-serif text-3xl md:text-4xl">Spotted something off?</h3>
          <p className="mt-3 text-[#4a4a44] max-w-xl mx-auto text-[14.5px]">Our trust team responds to every report within 4 business hours.</p>
          <a href="mailto:trust@mad.example" className="btn-orange mt-6 inline-flex">Contact Trust Team</a>
        </div>
      </section>
    </div>
  );
}
