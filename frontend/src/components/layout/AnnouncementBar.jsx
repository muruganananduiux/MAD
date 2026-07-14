import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const messages = [
  {
    main: "₹500",
    text: "a month funds a life-saving line of medicine for a child fighting cancer",
    sub: " — cancel anytime, no hidden charges."
  },
  {
    main: "₹500",
    text: "Medical Emergency Support is free for all, funded by donors like you.",
    sub: " — We pledge to bring hope during emergencies."
  },
  {
    main: "500",
    text: "Food Support is free for all, funded by donors like you.",
    sub: " — We pledge to fight hunger and spread kindness."
  },
  {
    main: "₹500",
    text: "Cancer Support is free for all, funded by donors like you.",
    sub: " — We pledge to stand with cancer warriors."
  },
  {
    main: "₹500",
    text: "Shelter Support is free for all, funded by donors like you.",
    sub: " — We pledge to provide care and comfort."
  }
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setIndex((prev) => (prev + 1) % messages.length);
  }, 10000);

  return () => clearInterval(timer);
}, []);
  return (
    <div className="w-full border-b border-[#E7DFCF] bg-[#FBF6EE]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3 text-sm text-[#4a4a44]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2F6E5B] text-white text-[10px] font-bold tracking-wider px-2 py-0.5">
            <Zap size={11} strokeWidth={2.5} /> TODAY
          </span>
          <span className="hidden md:inline text-[13px] transition-all duration-500">
  <span className="font-semibold text-[#14140F]">
    {messages[index].main}
  </span>{" "}
  {messages[index].text}
  <span className="text-[#a89b83]">
    {messages[index].sub}
  </span>
</span>
          <span className="md:hidden text-[12px] text-[#14140F] font-medium">
  {messages[index].main} {messages[index].text}
</span>
        </div>
        <Link to="/monthly-donation" className="btn-orange !py-2 !px-4 text-[12px] whitespace-nowrap">Donate Monthly</Link>
      </div>
    </div>
  );
}
