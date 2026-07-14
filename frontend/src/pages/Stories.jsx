import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { STORIES, IMAGES } from '@/data';
import { Play } from 'lucide-react';

export default function Stories() {
  return (
    <div>
      <PageHeader eyebrow="Stories of Impact" title="Real lives." italic="Real change." subtitle="Read the stories behind the numbers — the mothers, students, farmers and villagers whose lives changed because someone gave." image={IMAGES.woman1} />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <Link to={`/stories/${STORIES[0].id}`} className="block relative rounded-lg overflow-hidden group">
          <img src={IMAGES.heroChild2} alt="" className="w-full h-[440px] object-cover hero-image" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-105 transition"><Play size={22} className="text-[#14140F] ml-1" fill="#14140F" /></span>
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white max-w-2xl">
            <div className="text-[11px] tracking-[0.22em] uppercase text-[#F3B58C] font-semibold">Featured Story</div>
            <div className="font-serif text-2xl md:text-3xl italic mt-2">{STORIES[1].title}</div>
          </div>
        </Link>

        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {STORIES.map(s => (
            <Link key={s.id} to="/stories" className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-lg"><img src={s.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#4a4a44] mt-4">{s.date}</div>
              <div className="font-serif text-[19px] font-medium mt-2 leading-snug group-hover:text-[#EF6A3D] transition">{s.title}</div>
              <p className="text-[14px] text-[#4a4a44] mt-2">{s.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
