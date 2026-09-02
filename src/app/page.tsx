import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="home-shell">
      <section className="home-card">
        <span className="eyebrow">All Phase Electric & Maintenance, Inc.</span>
        <h1>Electrical work starts with a better first conversation.</h1>
        <p>Tell us what you need, add project details, and share when you are available. No account required.</p>
        <Link className="primary-button home-cta" href="/estimate">Request an estimate</Link>
        <p className="home-footnote">Your preferred date and time are requests until confirmed by All Phase.</p>
      </section>
    </main>
  );
}
