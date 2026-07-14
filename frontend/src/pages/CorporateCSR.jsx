import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { IMAGES } from '@/data';
import { Building2, PieChart, ClipboardCheck, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function CorporateCSR() {
  const [form, setForm] = useState({ name: '', company: '', email: '', budget: '' });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return toast.error('Please fill all required fields');
    toast.success(`Thanks ${form.name}! Our CSR team will reach out within 24 hours.`);
    setForm({ name: '', company: '', email: '', budget: '' });
  };
  return (
    <div>
      <PageHeader eyebrow="Corporate CSR" title="Turn CSR budgets into" italic="measurable outcomes." subtitle="MAD partners with 120+ Indian corporates to design, execute and report on high-impact CSR programmes under the Companies Act." image={IMAGES.charity5} />

      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-6">
        {[
          { icon: PieChart, t: 'Custom portfolios', d: 'Match your brand values to a curated set of verified causes.' },
          { icon: ClipboardCheck, t: 'Section 135 compliant', d: 'End-to-end audit trail, MCA filings and utilisation reports.' },
          { icon: TrendingUp, t: 'Impact dashboards', d: 'Real-time metrics on lives, learners and rupees delivered.' },
          { icon: Building2, t: 'Employee giving', d: 'Payroll giving + volunteering hooks for your teams.' },
        ].map(x => (
          <div key={x.t} className="p-6 bg-white border border-[#E7DFCF] rounded-lg">
            <x.icon size={26} className="text-[#EF6A3D]" strokeWidth={1.6} />
            <div className="font-serif text-lg mt-3 font-medium">{x.t}</div>
            <p className="text-[13.5px] text-[#4a4a44] mt-2 leading-relaxed">{x.d}</p>
          </div>
        ))}
      </section>

      <section className="bg-[#2F6E5B] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="section-eyebrow !text-[#F3B58C] mb-3">Partner with us</div>
            <h3 className="font-serif text-3xl md:text-4xl">Let’s design a programme in <span className="italic">two weeks.</span></h3>
            <p className="mt-3 text-white/85 text-[14.5px]">A short call. Then a written proposal with 3 cause portfolios, timelines and reporting cadence.</p>
          </div>
          <form onSubmit={submit} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 space-y-3">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name*" className="w-full px-4 py-2.5 rounded bg-white/95 text-[#14140F] text-[14px] focus:outline-none" />
            <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company*" className="w-full px-4 py-2.5 rounded bg-white/95 text-[#14140F] text-[14px] focus:outline-none" />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Work email*" type="email" className="w-full px-4 py-2.5 rounded bg-white/95 text-[#14140F] text-[14px] focus:outline-none" />
            <input value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="Approx CSR budget (INR)" className="w-full px-4 py-2.5 rounded bg-white/95 text-[#14140F] text-[14px] focus:outline-none" />
            <button className="btn-orange w-full justify-center">Request a Proposal</button>
          </form>
        </div>
      </section>
    </div>
  );
}
