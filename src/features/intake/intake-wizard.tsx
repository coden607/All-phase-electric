'use client';

import { useMemo, useState } from 'react';
import { companyConfig, type JobType, type ServiceType } from '@/config/company';

interface WizardState {
  jobType?: JobType;
  serviceType: ServiceType;
  description: string;
  urgency: 'normal' | 'soon' | 'urgent';
  street: string;
  city: string;
  state: string;
  zip: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'text';
  preferredDate: string;
  preferredPeriod: 'morning' | 'afternoon' | 'evening';
  consent: boolean;
}

const initialState: WizardState = {
  serviceType: 'troubleshooting',
  description: '',
  urgency: 'normal',
  street: '',
  city: '',
  state: 'NY',
  zip: '',
  name: '',
  email: '',
  phone: '',
  preferredContact: 'phone',
  preferredDate: '',
  preferredPeriod: 'morning',
  consent: false,
};

const stepNames = ['Job type', 'Project', 'Location', 'Contact', 'Timing', 'Review'];

const labels: Record<JobType, { title: string; detail: string }> = {
  residential: { title: 'Residential', detail: 'Homes, apartments, upgrades and troubleshooting' },
  commercial: { title: 'Commercial', detail: 'Offices, retail, facilities and business electrical work' },
  industrial: { title: 'Industrial', detail: 'Plants, controls, equipment and industrial maintenance' },
};

export function IntakeWizard({ embedded = false }: { embedded?: boolean }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(initialState);

  const percent = useMemo(() => Math.round(((step + 1) / stepNames.length) * 100), [step]);
  const canContinue = step !== 0 || Boolean(state.jobType);

  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="intake-shell" data-testid="intake-shell" data-embed={embedded ? 'true' : 'false'} aria-labelledby="estimate-title">
      <div className="intake-topbar">
        <div>
          <span className="eyebrow">Request an estimate</span>
          <h1 id="estimate-title">Tell us what you need.</h1>
          <p>Share the essentials in a few minutes. All Phase will review your request and confirm the next step.</p>
        </div>
        <div className="trust-pill" aria-label="Estimate request status">No account required</div>
      </div>

      <div className="progress-wrap" aria-label={`Step ${step + 1} of ${stepNames.length}: ${stepNames[step]}`}>
        <div className="progress-meta"><span>Step {step + 1} of {stepNames.length}</span><strong>{stepNames[step]}</strong></div>
        <div className="progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={stepNames.length} aria-valuenow={step + 1}>
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="wizard-card">
        {step === 0 && (
          <fieldset className="step-panel">
            <legend className="sr-only">Job type</legend>
            <div className="step-kicker">Start here</div>
            <h2 className="step-heading">What can we help with?</h2>
            <p className="step-copy">Choose the type of property or system so the request reaches the right workflow.</p>
            <div className="choice-grid">
              {companyConfig.jobTypes.map((jobType) => (
                <label key={jobType} className={`choice-card ${state.jobType === jobType ? 'selected' : ''}`}>
                  <input type="radio" name="jobType" value={jobType} checked={state.jobType === jobType} onChange={() => update('jobType', jobType)} />
                  <span className="choice-dot" aria-hidden="true" />
                  <strong>{labels[jobType].title}</strong>
                  <small>{labels[jobType].detail}</small>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div className="step-panel">
            <div className="step-kicker">Project details</div>
            <h2 className="step-heading">Tell us about the work</h2>
            <p className="step-copy">A little context now can make the first call much more useful.</p>
            <label className="field"><span>Service type</span>
              <select value={state.serviceType} onChange={(event) => update('serviceType', event.target.value as ServiceType)}>
                {companyConfig.services.map((service) => <option key={service} value={service}>{service.replaceAll('-', ' ')}</option>)}
              </select>
            </label>
            <label className="field"><span>Describe the project or problem</span>
              <textarea rows={6} value={state.description} onChange={(event) => update('description', event.target.value)} placeholder="What is happening, what would you like changed, and anything we should know before calling?" />
              <small>{state.description.length}/4000 characters</small>
            </label>
            <label className="field"><span>Timing</span>
              <select value={state.urgency} onChange={(event) => update('urgency', event.target.value as WizardState['urgency'])}>
                <option value="normal">Planning / flexible</option><option value="soon">Soon</option><option value="urgent">Urgent attention requested</option>
              </select>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="step-panel">
            <div className="step-kicker">Service location</div><h2 className="step-heading">Where is the work?</h2>
            <div className="field-grid two"><label className="field full"><span>Street address</span><input value={state.street} onChange={(e) => update('street', e.target.value)} autoComplete="street-address" /></label>
              <label className="field"><span>City</span><input value={state.city} onChange={(e) => update('city', e.target.value)} autoComplete="address-level2" /></label>
              <label className="field"><span>State</span><input value={state.state} onChange={(e) => update('state', e.target.value.toUpperCase())} maxLength={2} autoComplete="address-level1" /></label>
              <label className="field"><span>ZIP code</span><input inputMode="numeric" value={state.zip} onChange={(e) => update('zip', e.target.value)} autoComplete="postal-code" /></label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-panel">
            <div className="step-kicker">Your information</div><h2 className="step-heading">How should we reach you?</h2>
            <div className="field-grid two"><label className="field full"><span>Name</span><input value={state.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" /></label>
              <label className="field"><span>Email</span><input type="email" value={state.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" /></label>
              <label className="field"><span>Phone</span><input type="tel" value={state.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" /></label>
            </div>
            <fieldset className="inline-fieldset"><legend>Preferred contact</legend>{(['phone','email','text'] as const).map((method) => <label key={method}><input type="radio" name="preferredContact" checked={state.preferredContact === method} onChange={() => update('preferredContact', method)} /> {method[0].toUpperCase()+method.slice(1)}</label>)}</fieldset>
          </div>
        )}

        {step === 4 && (
          <div className="step-panel">
            <div className="step-kicker">Availability</div><h2 className="step-heading">What time works best?</h2>
            <p className="step-copy">This is a preference request, not a confirmed appointment. All Phase will confirm availability with you.</p>
            <div className="field-grid two"><label className="field"><span>Preferred date</span><input type="date" value={state.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} /></label>
              <label className="field"><span>Preferred time</span><select value={state.preferredPeriod} onChange={(e) => update('preferredPeriod', e.target.value as WizardState['preferredPeriod'])}><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></label>
            </div>
            <div className="upload-placeholder"><strong>Photos & documents</strong><p>Secure upload support is wired into the starter architecture and will accept common images and PDFs.</p><button type="button" className="secondary-button" disabled>Upload files — backend connection next</button></div>
          </div>
        )}

        {step === 5 && (
          <div className="step-panel">
            <div className="step-kicker">Review</div><h2 className="step-heading">Ready to send?</h2>
            <div className="review-grid"><div><span>Job type</span><strong>{state.jobType ? labels[state.jobType].title : '—'}</strong></div><div><span>Service</span><strong>{state.serviceType.replaceAll('-', ' ')}</strong></div><div><span>Contact</span><strong>{state.name || '—'}</strong></div><div><span>Preferred date</span><strong>{state.preferredDate || '—'}</strong></div></div>
            <label className="consent"><input type="checkbox" checked={state.consent} onChange={(e) => update('consent', e.target.checked)} /><span>I confirm this information is accurate and understand the requested date/time is not booked until All Phase confirms it.</span></label>
            <button type="button" className="primary-button wide" disabled={!state.consent}>Submit estimate request</button>
          </div>
        )}

        <div className="wizard-actions">
          <button type="button" className="secondary-button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>Back</button>
          {step < stepNames.length - 1 && <button type="button" className="primary-button" onClick={() => setStep((value) => Math.min(stepNames.length - 1, value + 1))} disabled={!canContinue}>Continue</button>}
        </div>
      </div>
      <p className="privacy-note">Your request is used only to evaluate and follow up on the electrical work you describe.</p>
    </section>
  );
}
