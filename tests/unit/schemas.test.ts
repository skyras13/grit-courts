import { describe, it, expect } from 'vitest';
import { leadSchema, renderWebhookSchema } from '@/lib/schemas';

describe('leadSchema', () => {
  const base = { fullName: 'Jane Homeowner', phone: '801-555-0142' };

  it('accepts a minimal valid lead', () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it('rejects a too-short phone number', () => {
    const r = leadSchema.safeParse({ ...base, phone: '12345' });
    expect(r.success).toBe(false);
  });

  it('rejects a missing name', () => {
    const r = leadSchema.safeParse({ phone: '801-555-0142' });
    expect(r.success).toBe(false);
  });

  it('allows an empty-string email but rejects an invalid one', () => {
    expect(leadSchema.safeParse({ ...base, email: '' }).success).toBe(true);
    expect(leadSchema.safeParse({ ...base, email: 'not-an-email' }).success).toBe(false);
  });

  it('defaults smsConsent to false and source to "site"', () => {
    const r = leadSchema.parse(base);
    expect(r.smsConsent).toBe(false);
    expect(r.source).toBe('site');
  });

  it('rejects an unknown court type', () => {
    const r = leadSchema.safeParse({ ...base, courtType: 'tennis' });
    expect(r.success).toBe(false);
  });
});

describe('renderWebhookSchema', () => {
  it('requires a uuid renderId and a valid status', () => {
    const ok = renderWebhookSchema.safeParse({
      renderId: '3f9a1b2c-1111-2222-3333-444455556666',
      status: 'done',
      renderedImageUrl: 'https://example.com/r.webp',
    });
    expect(ok.success).toBe(true);

    const bad = renderWebhookSchema.safeParse({ renderId: 'nope', status: 'done' });
    expect(bad.success).toBe(false);
  });
});
