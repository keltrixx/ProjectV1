import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import ListingCard from '../components/ListingCard.jsx';

const CATEGORIES = ['Uniform Shirt', 'Pants / Skirt', 'PE Uniform', 'Accessories'];

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/listings', { params: { limit: 8 } }).then((r) => setItems(r.data.items)).catch(() => {});
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/browse?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-navy px-6 py-10 text-white md:px-12 md:py-14">
        <h1 className="max-w-xl text-3xl font-extrabold leading-tight md:text-4xl">
          Pass on the uniform you've outgrown. Find the one you need.
        </h1>
        <p className="mt-3 max-w-lg text-white/80">
          Buy, sell, or swap school uniforms with other students on your campus.
        </p>
        <form onSubmit={search} className="mt-6 flex max-w-lg gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search polo, skirt, PE shirt…"
            className="w-full rounded-lg px-4 py-3 text-sm text-ink" aria-label="Search uniforms" />
          <button className="rounded-lg bg-white px-5 text-sm font-semibold text-navy">Search</button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Categories</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/browse?category=${encodeURIComponent(c)}`}
              className="card p-4 text-center text-sm font-semibold hover:border-navy">{c}</Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">Featured uniforms</h2>
          <Link to="/browse" className="text-sm font-medium text-navy">See all</Link>
        </div>
        {items.length === 0
          ? <p className="text-slate-500">No listings yet. Be the first to post a uniform.</p>
          : <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{items.map((l) => <ListingCard key={l._id} listing={l} />)}</div>}
      </section>
    </div>
  );
}
