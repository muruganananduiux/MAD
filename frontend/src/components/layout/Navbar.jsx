import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { LOGOUT } from '../../constants/testIds/auth';

const NAV = [
  { to: '/causes', label: 'Causes' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/ways-to-give', label: 'Ways to Give' },
  { to: '/stories', label: 'Stories' },
  { to: '/trust-safety', label: 'Trust & Safety' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const initials =
    user?.name
      ?.split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF6EE]/95 backdrop-blur border-b border-[#E7DFCF]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2" data-testid="navbar-logo">
          <img src="/images/header-logo.svg" alt="MAD" className="h-18 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              data-testid={`navbar-link-${n.label.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#E7DFCF] hover:border-[#EF6A3D] transition"
                data-testid="navbar-user-menu-trigger"
              >
                <span className="w-7 h-7 rounded-full bg-[#EF6A3D] text-white text-[12px] font-bold flex items-center justify-center">
                  {initials}
                </span>
                <span className="text-[13px] font-medium text-[#14140F]">{user.name.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-[#E7DFCF] bg-white shadow-lg py-2 z-50"
                  data-testid="navbar-user-menu"
                >
                  <div className="px-4 py-2 border-b border-[#E7DFCF]">
                    <div className="text-[13px] font-semibold text-[#14140F]">{user.name}</div>
                    <div className="text-[11px] text-[#4a4a44] truncate">{user.email}</div>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-[13px] hover:bg-[#F3EBDD]"
                      data-testid="navbar-admin-link"
                    >
                      <LayoutDashboard size={14} /> Admin dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[13px] hover:bg-[#F3EBDD]"
                    data-testid="navbar-profile-link"
                  >
                    <User size={14} /> My profile
                  </Link>
                  <Link
                    to="/my-donations"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[13px] hover:bg-[#F3EBDD]"
                    data-testid="navbar-donations-link"
                  >
                    <Heart size={14} /> My donations
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[13px] text-[#B33] hover:bg-[#FDECE4]"
                    data-testid={LOGOUT.button}
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-outline-ink !py-2 !px-5" onClick={() => navigate('/login')} data-testid="navbar-login-btn">
              Log in
            </button>
          )}
          <button
            className="btn-orange"
            onClick={() => navigate(isAuthenticated ? '/start-fundraiser' : '/login')}
            data-testid="navbar-start-fundraiser-btn"
          >
            Start a Fundraiser
          </button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu" data-testid="navbar-mobile-toggle">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#E7DFCF] bg-[#FBF6EE] px-6 py-4 space-y-2">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-2 text-[15px]">
              {n.label}
            </NavLink>
          ))}
          <div className="flex gap-2 pt-3">
            {isAuthenticated ? (
              <button
                className="btn-outline-ink flex-1"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                data-testid="navbar-mobile-logout-btn"
              >
                Log out
              </button>
            ) : (
              <button
                className="btn-outline-ink flex-1"
                onClick={() => {
                  setOpen(false);
                  navigate('/login');
                }}
                data-testid="navbar-mobile-login-btn"
              >
                Log in
              </button>
            )}
            <button
              className="btn-orange flex-1"
              onClick={() => {
                setOpen(false);
                navigate(isAuthenticated ? '/start-fundraiser' : '/login');
              }}
            >
              Start a Fundraiser
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
