import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';
import { toast } from 'sonner';

const COLS = [
  { title: 'Explore', links: [
    { to: '/all-causes', label: 'All Causes' },
    { to: '/live-campaigns', label: 'Live Campaigns' },
    { to: '/corporate-csr', label: 'Corporate Giving' },
    { to: '/ngo-partnerships', label: 'NGO Partnerships' },
  ]},
  { title: 'Company', links: [
    { to: '/about', label: 'About The Social Architects' },
    { to: '/our-impact', label: 'Our Impact' },
    { to: '/careers', label: 'Careers' },
  ]},
  { title: 'Support', links: [
    { to: '/help', label: 'Help Center' },
    { to: '/trust-safety', label: 'Trust & Safety' },
    { to: '/terms', label: 'Terms of Use' },
    { to: '/privacy', label: 'Privacy Policy' },
  ]},
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return toast.error('Enter a valid email');
    toast.success('Subscribed! We’ll be in touch.');
    setEmail('');
  };
  return (
    <footer className="bg-[#FBF6EE] border-t border-[#E7DFCF] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Logo & Description */}
          <div className="md:col-span-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/footer-logo.svg" alt="MAD" className="h-[150px] w-auto" />
            </Link>
            <p className="text-[13px] text-[#4a4a44] mt-4 max-w-sm leading-relaxed">
              MAD is a fundraising platform built to make giving simple, transparent and human — for causes that matter across India.
            </p>
            <div className="flex gap-3 mt-5 text-[#4a4a44]">
              <a href="#" className="hover:text-[#EF6A3D]"><Instagram size={18} /></a>
              <a href="#" className="hover:text-[#EF6A3D]"><Twitter size={18} /></a>
              <a href="#" className="hover:text-[#EF6A3D]"><Facebook size={18} /></a>
              <a href="#" className="hover:text-[#EF6A3D]"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-[#EF6A3D]"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Middle: Link Columns */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {COLS.map(col => (
              <div key={col.title}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#14140F] mb-4">{col.title}</div>
                {col.links.map(l => (
                  <Link key={l.to} to={l.to} className="footer-link">{l.label}</Link>
                ))}
              </div>
            ))}
          </div>

          {/* Right: Stay Updated */}
          <div className="md:col-span-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#14140F] mb-4">Stay Updated</div>
            <form onSubmit={submit} className="space-y-3">
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[13px] focus:outline-none focus:border-[#EF6A3D]" />
              <button type="submit" className="btn-orange w-full justify-center !py-2.5">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[#E7DFCF] flex flex-col md:flex-row md:items-center justify-between gap-2 text-[12px] text-[#4a4a44]">
        <div>© 2026 MAD by The Social Architects. All rights reserved.</div>
        <div className="flex gap-5">
          <Link to="/terms" className="hover:text-[#EF6A3D]">Terms</Link>
          <Link to="/privacy" className="hover:text-[#EF6A3D]">Privacy</Link>
          <Link to="/help" className="hover:text-[#EF6A3D]">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
