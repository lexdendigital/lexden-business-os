import React, { useState } from 'react';
import { useToast } from '@/components/common/Toast';
import { DemoFlag } from '@/components/common/MetricCard';
import {
  generateBusinessIdeaPlan,
  generateMarketingContent,
  generateCoachTip,
  type BusinessIdeaPlan,
  type MarketingContent,
  type MarketingContentType,
} from '@/lib/agent';
import { trackEvent } from '@/lib/analytics';
import { ideaPromptSchema, marketingPromptSchema, safeValidate } from '@/lib/validation/schemas';
import { useBusinessStore } from '@/state/businessStore';

type Tab = 'ai' | 'marketing' | 'coach';

const MARKETING_TYPES: { id: MarketingContentType; label: string }[] = [
  { id: 'status', label: 'Status' },
  { id: 'promo', label: 'Promo' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'followup', label: 'Follow Up' },
  { id: 'broadcast', label: 'Broadcast' },
];

export function Grow() {
  const [tab, setTab] = useState<Tab>('ai');

  return (
    <main className="screen">
      <div className="card" style={{ paddingBottom: 6 }}>
        <div className="chips" role="tablist" aria-label="Grow tools">
          <button role="tab" aria-pressed={tab === 'ai'} className="chip" onClick={() => setTab('ai')}>
            🚀 AI Generator
          </button>
          <button role="tab" aria-pressed={tab === 'marketing'} className="chip" onClick={() => setTab('marketing')}>
            📢 Marketing Studio
          </button>
          <button role="tab" aria-pressed={tab === 'coach'} className="chip" onClick={() => setTab('coach')}>
            🧠 Coach
          </button>
        </div>
      </div>

      {tab === 'ai' && <AiGeneratorPanel />}
      {tab === 'marketing' && <MarketingPanel />}
      {tab === 'coach' && <CoachPanel />}
    </main>
  );
}

function AiGeneratorPanel() {
  const [idea, setIdea] = useState('');
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<BusinessIdeaPlan | null>(null);
  const { business } = useBusinessStore();

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const result = safeValidate(ideaPromptSchema, { idea });
    if (!result.success) {
      setError(result.errors.idea || 'Describe your idea first');
      return;
    }
    setError('');
    setPlan(generateBusinessIdeaPlan(result.data.idea));
    trackEvent('ai_idea_generated', { length: idea.length }, business?.id);
  }

  return (
    <>
      <div className="card">
        <h2>AI Business Generator</h2>
        <p className="sub">Describe your hustle idea and get a starter plan.</p>
        <form onSubmit={handleGenerate} noValidate>
          <label className="field">
            <span>Your idea</span>
            <textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="I want to sell thrift clothes on campus." />
            {error && <span className="field-error">{error}</span>}
          </label>
          <button type="submit" className="btn btn-primary">
            Generate Plan
          </button>
        </form>
      </div>

      {plan && (
        <div className="card">
          <DemoFlag />
          <h3>Business Name Ideas</h3>
          <ul>
            {plan.nameIdeas.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <h3>Target Audience</h3>
          <p>{plan.targetAudience}</p>
          <h3>Brand Story</h3>
          <p>{plan.brandStory}</p>
          <h3>Startup Checklist</h3>
          <p>{plan.startupChecklist.join(' • ')}</p>
          <h3>Pricing</h3>
          <p>{plan.pricingGuidance}</p>
          <h3>Launch Plan</h3>
          <p>{plan.launchPlan.join(' · ')}</p>
          <h3>WhatsApp Promo</h3>
          <p>{plan.whatsappPromo}</p>
          <h3>Pitch</h3>
          <p>{plan.pitch}</p>
          <h3>Confidence Score</h3>
          <p>
            <b>{plan.confidenceScore}%</b> - practical and easy to test.
          </p>
        </div>
      )}
    </>
  );
}

function MarketingPanel() {
  const [product, setProduct] = useState('');
  const [type, setType] = useState<MarketingContentType>('status');
  const [content, setContent] = useState<MarketingContent | null>(null);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { business } = useBusinessStore();

  function handleGenerate(selectedType: MarketingContentType) {
    const result = safeValidate(marketingPromptSchema, { product, type: selectedType });
    if (!result.success) {
      setError(result.errors.product || 'Describe your product or offer first');
      return;
    }
    setError('');
    setType(selectedType);
    setContent(generateMarketingContent(result.data.product, selectedType));
    trackEvent('marketing_generated', { type: selectedType }, business?.id);
  }

  function copy(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast('Copied'));
    } else {
      showToast('Copy not supported on this device');
    }
  }

  function share(text: string) {
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      copy(text);
    }
  }

  return (
    <div className="card">
      <h2>WhatsApp Marketing Studio</h2>
      <div className="chips">
        {MARKETING_TYPES.map((m) => (
          <button key={m.id} className="chip" aria-pressed={type === m.id} onClick={() => handleGenerate(m.id)}>
            {m.label}
          </button>
        ))}
      </div>
      <label className="field">
        <span>Product or offer</span>
        <textarea value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Fresh thrift jackets" />
        {error && <span className="field-error">{error}</span>}
      </label>

      {content && (
        <div>
          <DemoFlag />
          <h3>Short Version</h3>
          <p>{content.short}</p>
          <h3>Long Version</h3>
          <p>{content.long}</p>
          <div className="copy-row" style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => copy(content.long)}>
              Copy
            </button>
            <button className="btn btn-secondary" onClick={() => share(content.long)}>
              Share
            </button>
            <button className="btn btn-outline" onClick={() => handleGenerate(type)}>
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CoachPanel() {
  const [tip, setTip] = useState<string | null>(null);
  const { business } = useBusinessStore();

  function getAdvice() {
    const result = generateCoachTip();
    setTip(result.tip);
    trackEvent('coach_tip_viewed', undefined, business?.id);
  }

  return (
    <div className="card">
      <h2>AI Coach</h2>
      <p className="sub">Get one practical tip for your business today.</p>
      <button className="btn btn-primary" onClick={getAdvice}>
        Get Advice
      </button>
      {tip && (
        <div style={{ marginTop: 14 }}>
          <DemoFlag />
          <p>{tip}</p>
        </div>
      )}
    </div>
  );
}
