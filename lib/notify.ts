/**
 * Speed-to-lead notifications: owner email (Resend), optional homeowner email,
 * outbound automation webhook (Make/Zapier/GHL), and optional SMS (Twilio).
 *
 * Every channel is best-effort and independent — one failing must not block the
 * others or the API response. All no-op cleanly when keys are absent. Target:
 * owner notified in < 60s of submission. See docs/04-features/feat-lead-pipeline.md.
 */
import 'server-only';
import { Resend } from 'resend';
import { env, capabilities } from './env';
import { formatUsd } from './pricing';
import type { Lead } from './types';

export interface NotifyContext {
  lead: Lead;
  renderUrl?: string | null;
  cityName?: string | null;
}

function ownerEmailHtml({ lead, renderUrl, cityName }: NotifyContext): string {
  const est =
    lead.estimated_min && lead.estimated_max
      ? `${formatUsd(lead.estimated_min)}–${formatUsd(lead.estimated_max)}`
      : '—';
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#27704a">🏀 New GRIT Courts lead</h2>
      <table style="width:100%;border-collapse:collapse">
        ${row('Name', lead.full_name)}
        ${row('Phone', `<a href="tel:${lead.phone}">${lead.phone}</a>`)}
        ${row('Email', lead.email ?? '—')}
        ${row('Address', lead.property_address ?? '—')}
        ${row('City', cityName ?? lead.city_slug ?? '—')}
        ${row('Court', `${lead.court_type ?? '—'} · ${lead.court_size ?? '—'}`)}
        ${row('Site', lead.land_condition ?? '—')}
        ${row('Estimate', est)}
        ${row('SMS consent', lead.sms_consent ? 'Yes' : 'No')}
        ${row('Source', lead.source)}
      </table>
      ${
        renderUrl
          ? `<p style="margin-top:16px"><strong>AI preview of their yard:</strong></p>
             <img src="${renderUrl}" alt="Rendered court" style="width:100%;border-radius:12px"/>`
          : ''
      }
      <p style="margin-top:16px;color:#475569">Call within 5 minutes for the best close rate.</p>
    </div>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 8px;color:#64748b;border-bottom:1px solid #eef2f7">${label}</td>
    <td style="padding:6px 8px;font-weight:600;border-bottom:1px solid #eef2f7">${value}</td>
  </tr>`;
}

async function sendOwnerEmail(ctx: NotifyContext): Promise<void> {
  if (!capabilities.email) return;
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: `GRIT Leads <${env.FROM_EMAIL}>`,
    to: env.OWNER_EMAIL,
    subject: `New lead: ${ctx.lead.full_name} — ${ctx.lead.court_type ?? 'court'} in ${ctx.cityName ?? 'Utah'}`,
    html: ownerEmailHtml(ctx),
  });
}

async function sendHomeownerEmail(ctx: NotifyContext): Promise<void> {
  if (!capabilities.email || !ctx.lead.email) return;
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: `GRIT Courts <${env.FROM_EMAIL}>`,
    to: ctx.lead.email,
    subject: 'Your GRIT Courts estimate — and a look at your court',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px">
        <h2 style="color:#27704a">Thanks, ${ctx.lead.full_name.split(' ')[0]}!</h2>
        <p>We got your request and a member of our team will reach out shortly to confirm
        the details and your free on-site design consult.</p>
        ${
          ctx.renderUrl
            ? `<p>Here's the AI preview of a court in your space:</p>
               <img src="${ctx.renderUrl}" alt="Your court preview" style="width:100%;border-radius:12px"/>`
            : ''
        }
        <p style="color:#475569">— The GRIT Courts team · builtwithgrit.com</p>
      </div>`,
  });
}

async function fireWebhook(ctx: NotifyContext): Promise<void> {
  if (!capabilities.webhook) return;
  await fetch(env.LEAD_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'lead.created', lead: ctx.lead, renderUrl: ctx.renderUrl }),
  });
}

async function sendOwnerSms(ctx: NotifyContext): Promise<void> {
  if (!capabilities.twilio) return;
  const body = `New GRIT lead: ${ctx.lead.full_name}, ${ctx.lead.phone} — ${ctx.lead.court_type ?? 'court'} in ${ctx.cityName ?? 'UT'}. Call now.`;
  const creds = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64');
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: env.OWNER_EMAIL.includes('@') ? '' : env.OWNER_EMAIL, // owner cell configured separately in prod
      From: env.TWILIO_FROM_NUMBER!,
      Body: body,
    }),
  }).catch(() => undefined);
}

/** Fan out all channels in parallel; never throw. Returns which channels fired. */
export async function notifyNewLead(ctx: NotifyContext): Promise<Record<string, boolean>> {
  const results = await Promise.allSettled([
    sendOwnerEmail(ctx),
    sendHomeownerEmail(ctx),
    fireWebhook(ctx),
    sendOwnerSms(ctx),
  ]);
  return {
    ownerEmail: results[0].status === 'fulfilled' && capabilities.email,
    homeownerEmail: results[1].status === 'fulfilled' && capabilities.email,
    webhook: results[2].status === 'fulfilled' && capabilities.webhook,
    sms: results[3].status === 'fulfilled' && capabilities.twilio,
  };
}
