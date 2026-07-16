import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '@/data';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/auth';
import { extractError } from '../lib/api';
import { REGISTER } from '../constants/testIds/auth';

export default function Signup() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return toast.error('Please enter your name and email');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setSubmitting(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });
      toast.success(`Welcome to MAD, ${user.name.split(' ')[0]}!`);
      nav('/', { replace: true });
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-140px)]">
      <div className="hidden md:block relative">
        <img src={IMAGES.heroChild2} alt="" className="absolute inset-0 w-full h-full object-cover hero-image" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#F3B58C] font-semibold mb-3">Join 21 lakh donors</div>
          <p className="font-serif italic text-3xl leading-snug">
            &ldquo;It takes one signup to change one life. Sometimes both.&rdquo;
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-10 bg-[#FBF6EE]">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 mb-8" data-testid="signup-home-link">
            <Heart size={22} className="text-[#EF6A3D]" fill="#EF6A3D" />
            <span className="font-serif italic text-xl font-semibold">MAD</span>
          </Link>
          <h1 className="font-serif text-3xl font-medium">Create your account</h1>
          <p className="text-[13.5px] text-[#4a4a44] mt-2">Free forever. Instant 80G receipts. One-tap monthly giving.</p>

          <form onSubmit={submit} className="space-y-3 mt-8" data-testid="signup-form">
            <input
              data-testid={REGISTER.nameInput}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              autoComplete="name"
              className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]"
            />
            <input
              data-testid={REGISTER.emailInput}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              autoComplete="email"
              placeholder="Email address"
              className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]"
            />
            <input
              data-testid="signup-phone-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone (optional)"
              autoComplete="tel"
              className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]"
            />
            <input
              data-testid={REGISTER.passwordInput}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              autoComplete="new-password"
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-orange w-full justify-center disabled:opacity-70"
              data-testid={REGISTER.submitButton}
            >
              {submitting ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#4a4a44] mt-6">
            Already registered?{' '}
            <Link to="/login" className="link-underline" data-testid={REGISTER.loginLink}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
