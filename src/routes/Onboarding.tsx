import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessStore } from '@/state/businessStore';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/common/Toast';
import { onboardingSchema, safeValidate, businessTypeSchema, businessGoalSchema } from '@/lib/validation/schemas';

const BUSINESS_TYPES = businessTypeSchema.options;
const GOALS = businessGoalSchema.options;

export function Onboarding() {
  const navigate = useNavigate();
  const { createBusiness } = useBusinessStore();
  const { signInDemo } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [goal, setGoal] = useState(GOALS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = safeValidate(onboardingSchema, { fullName, businessName, businessType, goal });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    signInDemo(result.data.fullName);
    createBusiness({ name: result.data.businessName, type: result.data.businessType, goal: result.data.goal });
    showToast(`Welcome to LEXDEN FORGE, ${result.data.fullName}`);
    navigate('/', { replace: true });
  }

  return (
    <main className="screen" id="onboarding">
      <div className="hero">
        <div className="eyebrow">LEXDEN FORGE</div>
        <h1>Build, sell, track and grow your hustle.</h1>
        <p>An AI-ready business operating system for Nigerian hustlers.</p>
      </div>

      <div className="card">
        <h2>Welcome 👋</h2>
        <p className="sub">Turn your hustle into a structured business from your phone. Takes under a minute.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Your name</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Chioma Okafor"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <span className="field-error" id="fullName-error">
                {errors.fullName}
              </span>
            )}
          </label>

          <label className="field">
            <span>Business name</span>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Chioma's Thrift Corner"
              aria-invalid={Boolean(errors.businessName)}
              aria-describedby={errors.businessName ? 'businessName-error' : undefined}
            />
            {errors.businessName && (
              <span className="field-error" id="businessName-error">
                {errors.businessName}
              </span>
            )}
          </label>

          <label className="field">
            <span>Business type</span>
            <select value={businessType} onChange={(e) => setBusinessType(e.target.value as typeof businessType)}>
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Main goal</span>
            <select value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)}>
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="btn btn-primary">
            Start Hustling
          </button>
        </form>

        <p className="small sub" style={{ marginTop: 14 }}>
          Built by <b>LEXDEN DIGITAL</b> · Headed by <b>Destiny Anselem</b>
        </p>
      </div>
    </main>
  );
}
