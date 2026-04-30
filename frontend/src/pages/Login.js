import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { overlayBulbasaur } from '../data/siteData';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { username: form.username, password: form.password });
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Log in failed');
    }
  }

  return (
    <div className="auth-page-shell">
      <div className="bulba-overlay" style={{ backgroundImage: `url(${overlayBulbasaur})` }} />
      <section className="auth-form-wrap">
        <h1 className="pixel-title giant-title auth-title-page">LOG IN</h1>
        <form className="pixel-form" onSubmit={handleSubmit}>
          <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Username" />
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="email@example.com" />
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" />
          {error && <p className="form-error">{error}</p>}
          <button className="pill-button giant" type="submit">Log In</button>
        </form>
      </section>
    </div>
  );
}
