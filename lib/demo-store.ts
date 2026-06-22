/**
 * In-memory fallback store for demo mode (no Supabase configured).
 *
 * Lets leads/renders persist for the lifetime of the server process so the
 * estimator → thank-you, the previewer polling flow, and the admin dashboard all
 * work end-to-end before any database is wired. When Supabase IS configured this
 * module is never used. NOT for production data — it's volatile by design.
 */
import 'server-only';
import type { Lead, Render } from './types';

const leads = new Map<string, Lead>();
const renders = new Map<string, Render>();

export const demoStore = {
  insertLead(lead: Lead): Lead {
    leads.set(lead.id, lead);
    return lead;
  },
  getLead(id: string): Lead | undefined {
    return leads.get(id);
  },
  updateLead(id: string, patch: Partial<Lead>): Lead | undefined {
    const existing = leads.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    leads.set(id, updated);
    return updated;
  },
  listLeads(): Lead[] {
    return [...leads.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  insertRender(render: Render): Render {
    renders.set(render.id, render);
    return render;
  },
  getRender(id: string): Render | undefined {
    return renders.get(id);
  },
  updateRender(id: string, patch: Partial<Render>): Render | undefined {
    const existing = renders.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    renders.set(id, updated);
    return updated;
  },
  listRenders(): Render[] {
    return [...renders.values()];
  },
};
