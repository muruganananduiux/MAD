import React from 'react';

export default function PageHeader({ eyebrow, title, italic, subtitle, image }) {
  return (
    <section className="relative border-b border-[#E7DFCF] bg-[#F3EBDD]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          {eyebrow && <div className="section-eyebrow mb-4">{eyebrow}</div>}
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] font-medium">
            {title} {italic && <span className="italic">{italic}</span>}
          </h1>
          {subtitle && <p className="mt-5 text-[15px] text-[#4a4a44] max-w-lg leading-relaxed">{subtitle}</p>}
        </div>
        {image && (
          <div className="relative rounded-lg overflow-hidden aspect-[5/4] md:aspect-[6/4] shadow-lg">
            <img src={image} alt="" className="w-full h-full object-cover hero-image" />
          </div>
        )}
      </div>
    </section>
  );
}
