import React from 'react';
import PageHeader from '../components/PageHeader';
import { JOBS, IMAGES } from '@/data';
import { MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Careers() {
  return (
    <div>
      <PageHeader eyebrow="Careers" title="Build the plumbing" italic="of India’s generosity." subtitle="We’re a small team building consequential software. If you like unglamorous problems with high-stakes outcomes, we’d love to talk." image={IMAGES.woman2} />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="section-eyebrow mb-3">Open roles</div>
        <h2 className="font-serif text-3xl md:text-4xl mb-8">We’re hiring across five teams.</h2>
        <div className="divide-y divide-[#E7DFCF] border-y border-[#E7DFCF]">
          {JOBS.map(j => (
            <div key={j.title} className="py-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              <div className="flex-1">
                <div className="font-serif text-xl font-medium">{j.title}</div>
                <div className="flex flex-wrap gap-4 mt-1 text-[13px] text-[#4a4a44]">
                  <span className="inline-flex items-center gap-1"><MapPin size={13} /> {j.location}</span>
                  <span className="inline-flex items-center gap-1"><Users size={13} /> {j.team}</span>
                </div>
              </div>
              <button onClick={() => toast.success('Application form opened. Good luck!')} className="btn-outline-ink !py-2 !px-5 text-[13px]">Apply →</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
