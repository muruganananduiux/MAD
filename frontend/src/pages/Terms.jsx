import React from 'react';
import PageHeader from '../components/PageHeader';
import { IMAGES } from '@/data';

const SECTIONS = [
  { t: '1. Acceptance', d: 'By using MAD you accept these Terms of Use and our Privacy Policy. If you do not agree, please do not use the platform.' },
  { t: '2. Eligibility', d: 'You must be 18 years or older and legally capable of entering into contracts to create a fundraiser or donate on MAD.' },
  { t: '3. Fundraiser responsibilities', d: 'Organisers must provide accurate information and use raised funds strictly for the stated purpose. Misuse may result in fund freeze and legal action.' },
  { t: '4. Donations', d: 'All donations are voluntary. MAD acts as an intermediary and does not guarantee the outcome of any campaign.' },
  { t: '5. Fees', d: 'MAD charges zero platform fee for personal medical fundraisers. Payment gateway fees may apply. Any changes will be notified in advance.' },
  { t: '6. Refund policy', d: 'Donations are generally non-refundable except in cases of proven fraud, verified through our trust & safety review.' },
  { t: '7. Prohibited use', d: 'Users may not create campaigns for illegal, harmful, misleading or hate-motivated purposes.' },
  { t: '8. Governing law', d: 'These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.' },
];

export default function Terms() {
  return (
    <div>
      <PageHeader eyebrow="Legal" title="Terms of" italic="Use." subtitle="Last updated — 15 April 2025. These terms govern your use of the MAD platform." image={IMAGES.charity3} />
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
