import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';

const NAV = [
  { to: '/causes', label: 'Causes' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/ways-to-give', label: 'Ways to Give' },
  { to: '/stories', label: 'Stories' },
  { to: '/trust-safety', label: 'Trust & Safety' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-[#FBF6EE]/95 backdrop-blur border-b border-[#E7DFCF]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/header-logo.svg" alt="MAD" className="h-18 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{n.label}</NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button className="btn-outline-ink !py-2 !px-5" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-orange" onClick={() => navigate('/start-fundraiser')}>Start a Fundraiser</button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#E7DFCF] bg-[#FBF6EE] px-6 py-4 space-y-2">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-2 text-[15px]">{n.label}</NavLink>
          ))}
          <div className="flex gap-2 pt-3">
            <button className="btn-outline-ink flex-1" onClick={() => { setOpen(false); navigate('/login'); }}>Log in</button>
            <button className="btn-orange flex-1" onClick={() => { setOpen(false); navigate('/start-fundraiser'); }}>Start a Fundraiser</button>
          </div>
        </div>
      )}
    </header>
  );
}
