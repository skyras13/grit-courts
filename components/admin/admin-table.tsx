'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LEAD_STATUSES, type Lead, type LeadStatus, type Render } from '@/lib/types';
import { formatUsd } from '@/lib/pricing';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: 'bg-court-100 text-court-800',
  contacted: 'bg-amber-100 text-amber-800',
  quoted: 'bg-violet-100 text-violet-800',
  won: 'bg-kelly-400/30 text-kelly-600',
  lost: 'bg-slate-100 text-slate-600',
};

export function AdminTable({
  leads,
  rendersById,
}: {
  leads: Lead[];
  rendersById: Record<string, Render>;
}) {
  const [rows, setRows] = useState(leads);

  async function setStatus(id: string, status: LeadStatus) {
    setRows((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => undefined);
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-fg-muted">
        No leads yet. Submit the estimator or previewer to see one land here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full min-w-[820px] text-sm">
        <thead className="bg-bg-muted text-left text-xs uppercase tracking-wide text-fg-muted">
          <tr>
            <th className="px-4 py-3">Lead</th>
            <th className="px-4 py-3">Court</th>
            <th className="px-4 py-3">Estimate</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Preview</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((l) => {
            const render = l.render_id ? rendersById[l.render_id] : undefined;
            return (
              <tr key={l.id} className="align-top">
                <td className="px-4 py-3">
                  <div className="font-semibold text-ink">{l.full_name}</div>
                  <a href={`tel:${l.phone}`} className="block text-brand-700">{l.phone}</a>
                  {l.email && <div className="text-fg-muted">{l.email}</div>}
                  {l.property_address && <div className="text-xs text-fg-muted">{l.property_address}</div>}
                  {l.sms_consent && <span className="mt-1 inline-block rounded bg-kelly-400/20 px-1.5 text-xs text-kelly-600">SMS OK</span>}
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  <div className="capitalize text-ink">{l.court_type ?? '—'}</div>
                  <div className="text-xs">{l.court_size ?? ''} {l.land_condition ? `· ${l.land_condition}` : ''}</div>
                  {l.city_slug && <div className="text-xs">📍 {l.city_slug}</div>}
                </td>
                <td className="px-4 py-3 text-ink">
                  {l.estimated_min && l.estimated_max
                    ? `${formatUsd(l.estimated_min)}–${formatUsd(l.estimated_max)}`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-fg-muted">{l.source}</td>
                <td className="px-4 py-3">
                  {render?.rendered_image_url ? (
                    <Image
                      src={render.rendered_image_url}
                      alt="Rendered court"
                      width={96}
                      height={72}
                      className="h-16 w-24 rounded object-cover"
                    />
                  ) : (
                    <span className="text-xs text-fg-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', STATUS_STYLE[l.status])}>
                    {l.status}
                  </span>
                  <select
                    value={l.status}
                    onChange={(e) => setStatus(l.id, e.target.value as LeadStatus)}
                    className="block w-full rounded border border-border px-2 py-1 text-xs"
                    aria-label={`Set status for ${l.full_name}`}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
