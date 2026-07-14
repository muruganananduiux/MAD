import React from 'react';
import PageHeader from '../components/PageHeader';
import { IMAGES } from '@/data';

const SECTIONS = [
  { t: 'What we collect', d: 'Name, email, phone, PAN (for tax receipts), payment information, campaign documents and browser activity on MAD.' },
  { t: 'How we use it', d: 'To verify fundraisers, process payments, send 80G receipts, prevent fraud and improve the platform.' },
  { t: 'Who we share with', d: 'Payment gateways, tax authorities (for 80G filings), and law enforcement when legally required. We never sell your data.' },
  { t: 'Data retention', d: 'Financial records are retained for 8 years as required by Indian tax law. Marketing data is deleted on request.' },
  { t: 'Your rights', d: 'You can request data export, correction or deletion by writing to privacy@mad.example.' },
  { t: 'Security', d: 'ISO 27001 certified infrastructure, PCI-DSS Level 1 payments, encryption at rest and in transit.' },
];

export default function Privacy() {
  return (
    <div>
      <PageHeader eyebrow="Legal" title="Privacy" italic="Policy." subtitle="Last updated — 15 April 2025. We collect only what we need and never sell your data." image={IMAGES.charity2} />
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        {SECTIONS.map(s => (
          <div key={s.t}>
            <div className="font-serif text-xl font-medium">{s.t}</div>
            <p className="text-[14.5px] text-[#4a4a44] mt-2 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
