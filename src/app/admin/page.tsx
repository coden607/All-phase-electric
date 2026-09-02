'use client';

import { useMemo, useState } from 'react';
import { demoLeads, formatCurrency, getAttentionLevel, getPipelineMetrics, getSmartSummary, type DemoLead } from '@/features/demo/sales-tools';

const statusLabel: Record<string, string> = {
  new: 'New', contacted: 'Contacted', scheduled: 'Scheduled', won: 'Won', lost: 'Lost',
};

export default function AdminPage() {
  const [leads, setLeads] = useState<DemoLead[]>(demoLeads);
  const [notice, setNotice] = useState('');
  const metrics = useMemo(() => getPipelineMetrics(leads), [leads]);
  const recoveredJobExample = 1000;
  const starterPrice = 500;

  const updateLead = (id: string, patch: Partial<DemoLead>, message: string) => {
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, ...patch } : lead));
    setNotice(message);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">All Phase Electric · Demo Admin</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Sales pipeline that keeps estimates from falling through the cracks.</h1>
            <p className="mt-2 max-w-3xl text-slate-400">Every request arrives organized, prioritized, contact-ready, and visible until it becomes a scheduled or won job.</p>
          </div>
          <a href="/estimate" className="rounded-xl bg-amber-400 px-5 py-3 text-center font-bold text-slate-950">Open customer estimate form</a>
        </header>

        {notice && <div role="status" className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">{notice}</div>}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Sales pipeline metrics">
          <Metric label="Open opportunities" value={String(metrics.openCount)} detail="New, contacted, or scheduled" />
          <Metric label="Pipeline value" value={formatCurrency(metrics.pipelineValue)} detail="Editable estimated job values" />
          <Metric label="Won in demo" value={formatCurrency(metrics.wonValue)} detail="Shows closed-job value" />
          <Metric label="Needs attention" value={String(metrics.needsAttention)} detail="Leads at risk of going cold" urgent={metrics.needsAttention > 0} />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_330px]">
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Live lead queue</h2>
                <p className="text-sm text-slate-400">Realistic demo requests show how Scott can work the entire pipeline from one screen.</p>
              </div>
              <div className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">Interactive demo</div>
            </div>

            <div className="space-y-4">
              {leads.map((lead) => {
                const attention = getAttentionLevel(lead);
                return (
                  <article key={lead.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold">{lead.jobType}</span>
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold">{statusLabel[lead.status]}</span>
                          {attention !== 'normal' && (
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${attention === 'urgent' ? 'bg-red-500/20 text-red-300' : 'bg-amber-400/20 text-amber-300'}`}>
                              {attention === 'urgent' ? 'Needs attention now' : 'Follow-up due'}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="text-xl font-bold">{lead.customer}</h3>
                          {lead.company && <span className="text-sm text-slate-400">{lead.company}</span>}
                          <span className="text-sm font-semibold text-emerald-300">{formatCurrency(lead.estimatedValue)} est. value</span>
                        </div>
                        <p className="mt-1 font-semibold text-slate-200">{lead.service}</p>
                        <p className="mt-3 rounded-xl bg-slate-950/70 p-3 text-sm leading-6 text-slate-300">
                          <strong className="text-slate-100">Smart job summary:</strong> {getSmartSummary(lead)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                          <span>Ref: {lead.id}</span><span>{lead.urgency}</span><span>{lead.minutesSinceCreated} min since request</span>
                          {lead.hasPhotos && <span>Photos attached</span>}
                        </div>
                      </div>

                      <div className="grid min-w-[220px] grid-cols-3 gap-2 lg:w-[260px]">
                        <a href={`tel:${lead.phone}`} className="rounded-lg bg-emerald-500 px-3 py-2 text-center text-sm font-bold text-slate-950">Call</a>
                        <a href={`sms:${lead.phone}`} className="rounded-lg bg-sky-500 px-3 py-2 text-center text-sm font-bold text-slate-950">Text</a>
                        <a href={`mailto:${lead.email}?subject=All%20Phase%20Electric%20-%20${encodeURIComponent(lead.id)}`} className="rounded-lg bg-violet-400 px-3 py-2 text-center text-sm font-bold text-slate-950">Email</a>
                        <button onClick={() => updateLead(lead.id, { status: 'scheduled', followUpDue: false }, `Appointment request confirmed for ${lead.customer}.`)} className="col-span-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold">Confirm {lead.preferredWindow}</button>
                        <button onClick={() => updateLead(lead.id, { status: 'won', followUpDue: false }, `Job marked won for ${lead.customer}.`)} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold">Mark won</button>
                        {lead.status === 'new' && <button onClick={() => updateLead(lead.id, { status: 'contacted', followUpDue: false }, `Follow-up logged for ${lead.customer}.`)} className="col-span-3 rounded-lg border border-amber-400/50 bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-200">Log follow-up / contacted</button>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="space-y-5">
            <Panel title="Automatic follow-up">
              <p className="text-sm leading-6 text-slate-300">If a new estimate sits untouched, the system flags it before it goes cold and can prepare a follow-up message for approval.</p>
              <div className="mt-4 space-y-3 text-sm">
                <Timeline time="0 min" text="Customer gets instant confirmation" />
                <Timeline time="15 min" text="Scott sees priority reminder" />
                <Timeline time="60 min" text="Lead escalates to Needs attention" />
                <Timeline time="Next day" text="Follow-up draft can be prepared" />
              </div>
            </Panel>

            <Panel title="Starter build ROI">
              <div className="rounded-xl bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-200">Example only — values are editable in production.</p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">{(recoveredJobExample / starterPrice).toFixed(1)}×</p>
                <p className="mt-1 text-sm text-slate-300">Recovering one {formatCurrency(recoveredJobExample)} job would equal 2× a {formatCurrency(starterPrice)} starter build.</p>
              </div>
            </Panel>

            <Panel title="What Scott gets">
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ Organized estimate requests</li>
                <li>✓ Photo-ready job intake</li>
                <li>✓ One-tap call, text, or email</li>
                <li>✓ Missed-lead protection</li>
                <li>✓ Follow-up reminders</li>
                <li>✓ Appointment-request shortcuts</li>
                <li>✓ Pipeline and job-value visibility</li>
                <li>✓ Mobile-friendly owner dashboard</li>
              </ul>
            </Panel>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, detail, urgent = false }: { label: string; value: string; detail: string; urgent?: boolean }) {
  return <div className={`rounded-2xl border p-5 ${urgent ? 'border-red-500/50 bg-red-500/10' : 'border-slate-800 bg-slate-900'}`}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-lg font-bold">{title}</h2><div className="mt-3">{children}</div></section>;
}

function Timeline({ time, text }: { time: string; text: string }) {
  return <div className="flex gap-3"><span className="w-16 shrink-0 font-semibold text-amber-300">{time}</span><span className="text-slate-300">{text}</span></div>;
}
