import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IMAGES } from '@/data';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/auth';
import { extractError } from '../lib/api';
import { LOGIN } from '../constants/testIds/auth';

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectFor = (user, fallback) => {
    if (user?.role === 'admin') return '/admin';
    return fallback || '/';
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in both fields');
    setSubmitting(true);
    try {
      const user = await login(form.email.trim().toLowerCase(), form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const from = location.state?.from;
      nav(redirectFor(user, from), { replace: true });
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-140px)]">
      <div className="hidden md:block relative">
        <img src={IMAGES.heroChild} alt="" className="absolute inset-0 w-full h-full object-cover hero-image" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#F3B58C] font-semibold mb-3">Welcome back</div>
          <p className="font-serif italic text-3xl leading-snug">
            &ldquo;One login. Every campaign you&rsquo;ve ever supported, all in one place.&rdquo;
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-10 bg-[#FBF6EE]">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 mb-8" data-testid="login-home-link">
            <img src="/images/header-logo.svg" alt="MAD" className="h-10 w-auto" />
          </Link>
          <h1 className="font-serif text-3xl font-medium">Log in to your account</h1>
          <p className="text-[13.5px] text-[#4a4a44] mt-2">
            Track your donations, 80G receipts and campaigns you follow.
          </p>

          <form onSubmit={submit} className="space-y-3 mt-8" data-testid="login-form">
            <input
              data-testid={LOGIN.emailInput}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              autoComplete="email"
              placeholder="Email address"
              className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]"
            />
            <div className="relative">
              <input
                data-testid={LOGIN.passwordInput}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Password"
                className="w-full px-4 py-2.5 pr-10 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a44]"
                aria-label="Toggle password visibility"
                data-testid="login-password-toggle"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <label className="flex items-center gap-2 text-[#4a4a44]">
                <input type="checkbox" /> Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-[#EF6A3D] font-semibold"
                data-testid={LOGIN.forgotPasswordLink}
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-orange w-full justify-center disabled:opacity-70"
              data-testid={LOGIN.submitButton}
            >
              {submitting ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#4a4a44] mt-6">
            New to MAD?{' '}
            <Link to="/signup" className="link-underline" data-testid={LOGIN.registerLink}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
