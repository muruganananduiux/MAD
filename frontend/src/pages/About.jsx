import React from 'react';
import PageHeader from '../components/PageHeader';
import { IMAGES, TESTIMONIALS } from '@/data';
import './About.css';

export default function About() {
  return (
    <div>
      <PageHeader eyebrow="About The Social Architects" title="Since 2008, we’ve been" italic="quietly rewiring how India gives." subtitle="Founded by three friends after the 2008 Bihar floods. Today, MAD is India’s most trusted giving platform — still stubbornly independent, still obsessed with the fine print." image={IMAGES.ruralFamily1} />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="section-eyebrow mb-3">OUR STORY</div>
        <h2 className="about-heading">A timeline of trust, built one campaign at a time.</h2>

        <div className="about-timeline mt-10">
          <div className="timeline-line" />
          <ul className="timeline-list">
            <li className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-year">2008</div>
                <div className="timeline-title">Started as a WhatsApp group after the Kosi floods.</div>
                <div className="timeline-desc">Small beginnings: neighbours, urgency and a single WhatsApp chain that became a movement.</div>
              </div>
            </li>

            <li className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-year">2014</div>
                <div className="timeline-title">First 100 verified NGO partners; launched 80G receipts.</div>
                <div className="timeline-desc">Formal partnerships and tax-compliant receipts made giving safer and more scalable.</div>
              </div>
            </li>

            <li className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-year">2024</div>
                <div className="timeline-title">₹960 Cr+ raised for 48,200+ fundraisers across India.</div>
                <div className="timeline-desc">A nation-wide footprint: impact measured in lives reached and funds delivered transparently.</div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="section-eyebrow mb-3">LEADERSHIP</div>
        <h2 className="about-heading">The team behind the process.</h2>

        <div className="leaders-grid mt-10">
          {[{
            name: 'Palavi Mohan', role: 'Co-founder & Head of Trust', img: IMAGES.woman1
          },{
            name: 'Prachi Rudra', role: 'Head of Partnerships', img: IMAGES.woman2
          },{
            name: 'Kavya Menon', role: 'Head of Verification', img: IMAGES.ruralFamily2
          },{
            name: 'Ritu Sharma', role: 'Co-founder & CEO', img: IMAGES.ruralFamily3
          }].map(p => (
            <div key={p.name} className="leader-card">
              <div className="leader-img-wrap">
                <img src={p.img} alt={p.name} className="leader-img" />
              </div>
              <div className="leader-meta">
                <div className="leader-name">{p.name}</div>
                <div className="leader-role">{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F3EBDD] border-y border-[#E7DFCF]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="section-eyebrow mb-3">What people say</div>
          <h2 className="font-serif text-3xl md:text-4xl">Words from our community.</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white border border-[#E7DFCF] rounded-lg p-6">
                <p className="font-serif italic text-[17px] leading-relaxed">“{t.quote}”</p>
                <div className="mt-5"><div className="font-semibold text-[14px]">{t.name}</div><div className="text-[12px] text-[#4a4a44]">{t.role}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
