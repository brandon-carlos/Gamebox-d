import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { overlayBulbasaur } from '../data/siteData';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { data } = await api.post('/auth/signup', {
        username: form.username,
        password: form.password,
        bio: `${form.firstName} ${form.lastName}`.trim(),
      });
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed');
    }
  }

  return (
    <div className="auth-page-shell sign-up-mode">
      <div className="bulba-overlay" style={{ backgroundImage: `url(${overlayBulbasaur})` }} />
      <section className="auth-form-wrap">
        <h1 className="pixel-title giant-title auth-title-page">SIGN IN</h1>
        <form className="pixel-form" onSubmit={handleSubmit}>
          <input value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} placeholder="First name" />
          <input value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} placeholder="Last name" />
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="email@example.com" />
          <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Username" />
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Create Password" />
          <input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Confirm Password" />
          {error && <p className="form-error">{error}</p>}
          <button className="pill-button giant" type="submit">Create Account</button>
        </form>
      </section>
    </div>
  );
}
