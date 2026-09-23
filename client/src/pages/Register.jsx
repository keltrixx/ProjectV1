import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', studentId: '', email: '', program: '', yearLevel: YEARS[0], password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setBusy(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            student_id: form.studentId,
            program: form.program,
            year_level: form.yearLevel,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Handle Supabase email confirmation check
      if (data?.user && data?.session === null) {
        setMessage('Registration successful! Please check your email to confirm your account before logging in.');
      } else {
        // If email confirmation is disabled in Supabase, redirect directly to login
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Failed to create account');
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
      {message && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
      
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