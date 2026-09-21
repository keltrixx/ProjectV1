import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', studentId: '', email: '', program: '', yearLevel: YEARS[0], password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const field = (id, label, type = 'text') => (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} type={type} required className="input" value={form[id]} onChange={set(id)} />
    </div>
  );

  return (
    <form onSubmit={submit} className="card mx-auto mt-6 max-w-md space-y-4 p-6">
      <div>
        <h1 className="text-xl font-bold">Create account</h1>
        <p className="text-sm text-slate-500">Join your school community.</p>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {field('fullName', 'Full name')}
      {field('studentId', 'Student ID')}
      {field('email', 'Email address', 'email')}
      {field('program', 'Program / Course')}
      <div>
        <label className="label" htmlFor="yearLevel">Year level</label>
        <select id="yearLevel" className="input" value={form.yearLevel} onChange={set('yearLevel')}>
          {YEARS.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>
      {field('password', 'Password', 'password')}
      {field('confirmPassword', 'Confirm password', 'password')}
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      <p className="text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="font-semibold text-navy">Log in</Link>
      </p>
    </form>
  );
}
