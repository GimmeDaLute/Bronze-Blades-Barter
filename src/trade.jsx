import React from 'react';
import { Link } from 'react-router-dom';

export default function Trade() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"> Trade</h1>
      <p>Commodities, Luxuries, and more!</p>
      <Link to="/" className="text-blue-600 underline mt-4 block">← Home</Link>
    </div>
  );
}
