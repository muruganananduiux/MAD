import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { CAUSES, IMAGES } from '@/data';
import { toast } from 'sonner';

export default function StartFundraiser() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ cause: '', title: '', goal: '', story: '', beneficiary: '', phone: '' });
  const next = () => {
    if (step === 1 && !f.cause) return toast.error('Please choose a cause');
    if (step === 2 && (!f.title || !f.goal)) return toast.error('Add a title and goal amount');
    if (step === 3 && !f.story) return toast.error('Write your story');
    setStep(s => s + 1);
  };
  const submit = () => {
    if (!f.beneficiary || !f.phone) return toast.error('Fill beneficiary details');
    toast.success('Fundraiser submitted for verification! We’ll be in touch within 24 hours.');
    setTimeout(() => nav('/'), 800);
  };
  return (
    <div>
      <PageHeader eyebrow="Start a Fundraiser" title="A story worth" italic="telling once." subtitle="Four short steps. Our team verifies your campaign before it goes live." image={IMAGES.ruralFamily2} />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          {[1,2,3,4].map(n => (
            <React.Fragment key={n}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${step >= n ? 'bg-[#EF6A3D] text-white' : 'bg-[#F3EBDD] text-[#a89b83]'}`}>{n}</div>
              {n < 4 && <div className={`flex-1 h-0.5 ${step > n ? 'bg-[#EF6A3D]' : 'bg-[#E7DFCF]'}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="section-eyebrow mb-3">Step 1</div>
            <h2 className="font-serif text-3xl mb-6">What are you raising for?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CAUSES.map(c => (
                <button key={c.slug} onClick={() => setF({...f, cause: c.slug})} className={`p-4 rounded-lg border text-left text-[14px] font-medium transition ${f.cause === c.slug ? 'border-[#EF6A3D] bg-[#FDECE4]' : 'border-[#E7DFCF] bg-white hover:border-[#a89b83]'}`}>{c.name}</button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="section-eyebrow mb-3">Step 2</div>
            <h2 className="font-serif text-3xl">Title and goal</h2>
            <input value={f.title} onChange={e => setF({...f, title: e.target.value})} placeholder="Campaign title" className="w-full px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D]" />
            <input value={f.goal} onChange={e => setF({...f, goal: e.target.value})} type="number" placeholder="Goal amount in ₹" className="w-full px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D]" />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="section-eyebrow mb-3">Step 3</div>
            <h2 className="font-serif text-3xl">Tell the story</h2>
            <textarea value={f.story} onChange={e => setF({...f, story: e.target.value})} rows={7} placeholder="Who is this for, why now, and what will the funds cover?" className="w-full px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D]" />
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div className="section-eyebrow mb-3">Step 4</div>
            <h2 className="font-serif text-3xl">Beneficiary details</h2>
            <input value={f.beneficiary} onChange={e => setF({...f, beneficiary: e.target.value})} placeholder="Beneficiary full name" className="w-full px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D]" />
            <input value={f.phone} onChange={e => setF({...f, phone: e.target.value})} placeholder="Contact phone (for verification)" className="w-full px-4 py-3 border border-[#E7DFCF] rounded-md bg-white focus:outline-none focus:border-[#EF6A3D]" />
          </div>
        )}

        <div className="flex justify-between mt-10">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} className="btn-ghost" disabled={step === 1}>← Back</button>
          {step < 4 ? <button onClick={next} className="btn-orange">Continue →</button> : <button onClick={submit} className="btn-orange">Submit for verification</button>}
        </div>
      </section>
    </div>
  );
}
