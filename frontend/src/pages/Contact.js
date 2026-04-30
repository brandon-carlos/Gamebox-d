import { useState } from 'react';
import { contactCards, overlayBulbasaur } from '../data/siteData';

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
    setForm({ firstName: '', lastName: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="page-stack contact-page-with-overlay">
      <div className="bulba-overlay contact-bulba-overlay" style={{ backgroundImage: `url(${overlayBulbasaur})` }} />
      <section className="simple-title-wrap contact-title-wrap">
        <h1 className="pixel-title giant-title">CONTACT US</h1>
      </section>
      <section className="contact-form-area">
        <form className="pixel-form contact-form" onSubmit={handleSubmit}>
          <input value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} placeholder="First name" />
          <input value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} placeholder="Last name" />
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="email@example.com" />
          <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Aa, 123, @#$, and more!" rows={4} />
          <button className="pill-button giant" type="submit">Send</button>
          {sent && <p className="form-success">Message sent!</p>}
        </form>
      </section>
      <section className="contact-card-row">
        {contactCards.map((contact) => (
          <article key={contact.id} className="contact-person-card">
            <h3>{contact.name}</h3>
            <img loading="lazy" decoding="async" src={contact.image} alt={contact.name} />
            <p>{contact.gamesPlayed} games played</p>
            <p>{contact.reviews} games reviewed</p>
            <p>{contact.email}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
