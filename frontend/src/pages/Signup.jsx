import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '@/data';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 6) return toast.error('Fill all fields (password 6+ chars)');
    localStorage.setItem('mad_user', JSON.stringify({ email: form.email, name: form.name }));
    toast.success('Account created!');
    setTimeout(() => nav('/'), 500);
  };
  const google = () => {
    localStorage.setItem('mad_user', JSON.stringify({ email: 'user@google.com', name: 'Google User' }));
    toast.success('Signed up with Google (mock)');
    setTimeout(() => nav('/'), 500);
  };
  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-140px)]">
      <div className="hidden md:block relative">
        <img src={IMAGES.heroChild2} alt="" className="absolute inset-0 w-full h-full object-cover hero-image" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#F3B58C] font-semibold mb-3">Join 21 lakh donors</div>
          <p className="font-serif italic text-3xl leading-snug">“It takes one signup to change one life. Sometimes both.”</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-10 bg-[#FBF6EE]">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <Heart size={22} className="text-[#EF6A3D]" fill="#EF6A3D" />
            <span className="font-serif italic text-xl font-semibold">MAD</span>
          </Link>
          <h1 className="font-serif text-3xl font-medium">Create your account</h1>
          <p className="text-[13.5px] text-[#4a4a44] mt-2">Free forever. Instant 80G receipts. One-tap monthly giving.</p>

          <button onClick={google} className="mt-8 w-full flex items-center justify-center gap-3 border border-[#E7DFCF] rounded-full py-2.5 bg-white hover:bg-[#F3EBDD] transition">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            <span className="text-[14px] font-medium">Sign up with Google</span>
          </button>

          <div className="flex items-center gap-3 my-6"><div className="flex-1 h-px bg-[#E7DFCF]" /><span className="text-[11px] uppercase tracking-[0.16em] text-[#a89b83]">or</span><div className="flex-1 h-px bg-[#E7DFCF]" /></div>

          <form onSubmit={submit} className="space-y-3">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="Email address" className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
            <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} type="password" placeholder="Password (min 6 characters)" className="w-full px-4 py-2.5 border border-[#E7DFCF] rounded-md bg-white text-[14px] focus:outline-none focus:border-[#EF6A3D]" />
            <button className="btn-orange w-full justify-center">Create account</button>
          </form>

          <p className="text-center text-[13px] text-[#4a4a44] mt-6">Already registered? <Link to="/login" className="link-underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
