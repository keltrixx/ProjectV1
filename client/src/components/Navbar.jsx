import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkCls = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-lg ${isActive ? 'bg-white/15 text-white' : 'text-white/75 hover:text-white'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { to: '/', label: 'Home', end: true },
    { to: '/browse', label: 'Browse' },
    ...(user ? [{ to: '/sell', label: 'Sell' }, { to: '/messages', label: 'Messages' }, { to: '/profile', label: 'Profile' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <>
      {/* Top bar: always visible; holds the nav links on desktop */}
      <header className="sticky top-0 z-30 bg-navy">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-extrabold tracking-tight text-white">SUEPS</Link>

          <nav className="hidden gap-1 md:flex">
            {tabs.map((t) => <NavLink key={t.to} {...t} className={linkCls}>{t.label}</NavLink>)}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-white/80 hover:text-white">Log out</button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white">Log in</Link>
                <Link to="/register" className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bottom bar: phones only, mirrors the wireframe's tab bar */}
      {user && (
        <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white py-2 md:hidden">
          {tabs.filter((t) => t.to !== '/admin').map((t) => (
            <NavLink key={t.to} {...t}
              className={({ isActive }) => `px-2 py-1 text-xs font-medium ${isActive ? 'text-navy' : 'text-slate-500'}`}>
              {t.label}
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}
