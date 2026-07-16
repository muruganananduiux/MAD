import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <div className="font-serif italic text-[#EF6A3D] text-7xl">404</div>
      <h1 className="font-serif text-3xl mt-4">This page seems to have gone giving elsewhere.</h1>
      <Link to="/" className="btn-orange mt-8 inline-flex">Back to home</Link>
    </div>
  );
}
