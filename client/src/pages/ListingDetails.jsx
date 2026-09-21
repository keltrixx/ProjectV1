import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ListingDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [active, setActive] = useState(0);
  const [option, setOption] = useState('Buy');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get(`/listings/${id}`).then((r) => setListing(r.data)).catch((e) => setNotice({ type: 'error', text: errMsg(e) }));
  }, [id]);

  if (!listing) return <p className="py-12 text-center text-slate-500">{notice.text || 'Loading…'}</p>;

  const isOwner = user && listing.seller._id === user._id;
  const needLogin = () => navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });

  const sendRequest = async () => {
    if (!user) return needLogin();
    try {
      await api.post('/requests', { listing: id, option, message });
      setNotice({ type: 'ok', text: 'Request sent. The seller will respond soon.' });
    } catch (e) {
      setNotice({ type: 'error', text: errMsg(e) });
    }
  };

  const messageSeller = async () => {
    if (!user) return needLogin();
    try {
      await api.post('/messages/conversations', { userId: listing.seller._id, listingId: id });
      navigate('/messages');
    } catch (e) {
      setNotice({ type: 'error', text: errMsg(e) });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <div className="aspect-square overflow-hidden rounded-xl bg-sky">
          {listing.images[active]
            ? <img src={listing.images[active]} alt={listing.title} className="h-full w-full object-cover" />
            : <div className="flex h-full items-center justify-center text-slate-400">No photo</div>}
        </div>
        {listing.images.length > 1 && (
          <div className="mt-2 flex gap-2">
            {listing.images.map((src, i) => (
              <button key={src} onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === active ? 'border-navy' : 'border-transparent'}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <p className="text-2xl font-extrabold text-navy">₱{listing.price}</p>
        </div>

        <div className="card flex items-center justify-between p-3">
          <div>
            <p className="text-sm font-semibold">{listing.seller.fullName}</p>
            <p className="text-xs text-slate-500">
              {listing.seller.ratingCount ? `★ ${listing.seller.ratingAvg} (${listing.seller.ratingCount} reviews)` : 'No reviews yet'}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-slate-500">Size</dt><dd className="font-medium">{listing.size}</dd></div>
          <div><dt className="text-slate-500">Condition</dt><dd className="font-medium">{listing.condition}</dd></div>
          <div><dt className="text-slate-500">Category</dt><dd className="font-medium">{listing.category}</dd></div>
          <div><dt className="text-slate-500">Available</dt><dd className="font-medium">{listing.quantity}</dd></div>
          <div className="col-span-2"><dt className="text-slate-500">Accepts</dt><dd className="font-medium">{listing.exchangeOption}</dd></div>
        </dl>

        {listing.description && <p className="text-sm text-slate-700">{listing.description}</p>}

        {notice.text && (
          <p role="status" className={`rounded-lg p-3 text-sm ${notice.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{notice.text}</p>
        )}

        {isOwner ? (
          <p className="rounded-lg bg-sky p-3 text-sm">This is your listing.</p>
        ) : listing.status !== 'available' ? (
          <p className="rounded-lg bg-slate-100 p-3 text-sm">This uniform is {listing.status}.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              {['Buy', 'Exchange'].map((o) => (
                <button key={o} onClick={() => setOption(o)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${option === o ? 'border-navy bg-navy text-white' : 'border-slate-300 bg-white'}`}>{o}</button>
              ))}
            </div>
            <textarea className="input" rows={2} placeholder="Add a note for the seller (optional)"
              value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="btn-primary w-full" onClick={sendRequest}>Request exchange</button>
            <button className="btn-outline w-full" onClick={messageSeller}>Message seller</button>
          </div>
        )}
      </div>
    </div>
  );
}
