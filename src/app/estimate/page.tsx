'use client';

import { FormEvent, useMemo, useState } from 'react';

type JobType = 'Residential' | 'Commercial' | 'Industrial';

const jobTypes: JobType[] = ['Residential', 'Commercial', 'Industrial'];
const serviceOptions = [
  'Electrical repair / troubleshooting',
  'Panel replacement / service upgrade',
  'Lighting / fixtures / controls',
  'New wiring / renovation',
  'Generator / backup power',
  'Data / LAN wiring',
  'Fire alarm / emergency lighting',
  'Low-voltage / telecom wiring',
  'Surge protection',
  'Maintenance service',
  'PLC / industrial controls',
  'Bucket truck service',
  'Other electrical work',
];

export default function EstimatePage() {
  const [jobType, setJobType] = useState<JobType>('Residential');
  const [submitted, setSubmitted] = useState(false);
  const reference = useMemo(() => `APE-DEMO-${new Date().getFullYear()}`, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
        <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Demo submission</p>
          <h1 className="mt-2 text-3xl font-bold">Request captured successfully.</h1>
          <p className="mt-4 leading-7 text-slate-600">In the live version, this request is stored first, then All Phase receives an email notification with a private link to the lead dashboard.</p>
          <div className="mt-6 rounded-2xl bg-slate-100 p-5">
            <div className="text-sm text-slate-500">Example reference</div>
            <div className="mt-1 font-mono text-lg font-semibold">{reference}</div>
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 p-5 text-sm text-slate-600">
            <strong className="text-slate-900">What happens next:</strong> All Phase reviews the request and confirms the estimate or appointment window directly with the customer. Requested times are never presented as booked until confirmed.
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setSubmitted(false)} className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Try another request</button>
            <a href="/admin" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800">See owner handoff →</a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="text-sm font-semibold text-slate-600">← All Phase Electric &amp; Maintenance, Inc.</a>
        <header className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-9">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <span>Over 50 years of experience</span><span aria-hidden="true">•</span><span>Binghamton &amp; surrounding areas within 60 miles</span>
          </div>
          <div className="mt-4 inline-flex rounded-full bg-amber-400 px-3 py-1 text-sm font-bold text-slate-950">Estimate request demo</div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Tell us about your electrical project.</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Residential, commercial, or industrial — give All Phase the details needed to respond quickly and prepare for the job.</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
            <span>✓ No account required</span><span>✓ Photo-ready intake</span><a href="tel:6077976535" className="font-semibold text-amber-300">607-797-6535</a>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-semibold">1. What type of work is this?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {jobTypes.map((type) => (
                <button key={type} type="button" onClick={() => setJobType(type)} aria-pressed={jobType === type} className={`rounded-2xl border p-4 text-left transition ${jobType === type ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                  <span className="font-semibold">{type}</span>
                  <span className={`mt-1 block text-xs ${jobType === type ? 'text-slate-300' : 'text-slate-500'}`}>{type === 'Residential' ? 'Home, apartment, or residential property' : type === 'Commercial' ? 'Retail, office, restaurant, or business property' : 'Facility, plant, warehouse, or industrial site'}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-semibold">2. What do you need help with?</h2>
            <p className="mt-2 text-sm text-slate-500">Choose the closest match. If you are not sure, select Other electrical work and describe the issue.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Service
                <select required className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
                  <option value="">Choose a service</option>
                  {serviceOptions.map((service) => <option key={service}>{service}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Urgency
                <select required className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option>Normal</option><option>Soon</option><option>Urgent</option></select>
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium">Describe the problem or project
              <textarea required rows={5} placeholder="Example: We need a 200A panel upgrade and want to add an EV charger in the garage." className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </label>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-semibold">3. Property and timing</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium sm:col-span-2">Service address<input required placeholder="Street address" autoComplete="street-address" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
              <label className="text-sm font-medium">City<input required autoComplete="address-level2" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
              <label className="text-sm font-medium">ZIP code<input required inputMode="numeric" autoComplete="postal-code" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
              <label className="text-sm font-medium">Preferred day<input type="date" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
              <label className="text-sm font-medium">Preferred time<select className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option>Morning</option><option>Afternoon</option><option>Either works</option></select></label>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Requested times are preferences, not confirmed appointments. All Phase will confirm availability.</p>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-semibold">4. How should we contact you?</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium sm:col-span-2">Name<input required autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
              <label className="text-sm font-medium">Email<input required type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
              <label className="text-sm font-medium">Phone<input required type="tel" autoComplete="tel" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
              <label className="text-sm font-medium">Preferred contact<select className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option>Phone</option><option>Email</option><option>Text</option></select></label>
              <label className="text-sm font-medium">Photos or documents<input type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm" /></label>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Photos of the panel, equipment, affected area, or existing installation can help the team understand the request before following up.</p>
          </section>

          <div className="flex flex-col gap-3 rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div><div className="font-semibold">Ready to preview the handoff?</div><div className="mt-1 text-sm text-slate-300">This demo does not send email or store customer data.</div></div>
            <button type="submit" className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 shadow-sm hover:bg-amber-300">Submit demo request</button>
          </div>
        </form>
      </div>
    </main>
  );
}
