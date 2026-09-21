import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  const { _id, title, price, size, condition, images, seller } = listing;
  return (
    <Link to={`/listings/${_id}`} className="card block overflow-hidden transition hover:border-navy">
      <div className="aspect-square bg-sky">
        {images?.[0]
          ? <img src={images[0]} alt={title} className="h-full w-full object-cover" loading="lazy" />
          : <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo</div>}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{title}</h3>
        <p className="text-xs text-slate-500">Size {size} · {condition}</p>
        <p className="mt-1 text-base font-bold text-navy">₱{price}</p>
        {seller && <p className="mt-1 truncate text-xs text-slate-500">{seller.fullName}</p>}
      </div>
    </Link>
  );
}
