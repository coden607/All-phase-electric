export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="mb-4 inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
          All Phase Electric & Maintenance, Inc.
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Request an electrical estimate without the back-and-forth.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Tell us what you need, add photos if helpful, and choose the best time for us to follow up. No account required.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/estimate" className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm">
            Start estimate request
          </a>
          <a href="#how-it-works" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold">
            How it works
          </a>
        </div>
        <div id="how-it-works" className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            ['1', 'Describe the job', 'Choose residential, commercial, or industrial and tell us what needs attention.'],
            ['2', 'Add useful details', 'Include the service address, timing, preferred contact method, and optional photos.'],
            ['3', 'Get a reference', 'Submit once and receive a clear request reference for follow-up.'],
          ].map(([number, title, text]) => (
            <article key={number} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 font-bold">{number}</div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
