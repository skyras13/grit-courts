/**
 * Persistence repository. Single interface over Supabase (when configured) and
 * the in-memory demo store (otherwise). API routes call only this — they never
 * branch on whether a DB exists. Returns plain domain types from lib/types.ts.
 */
import 'server-only';
import { getServiceClient } from './supabase';
import { demoStore } from './demo-store';
import type { Lead, LeadStatus, Render } from './types';

function nowIso(): string {
  return new Date().toISOString();
}

// ── Leads ───────────────────────────────────────────────────────────────────

export type NewLead = Omit<Lead, 'id' | 'created_at' | 'status'> & {
  status?: LeadStatus;
};

export async function createLead(input: NewLead): Promise<Lead> {
  const supabase = getServiceClient();
  const lead: Lead = {
    id: crypto.randomUUID(),
    created_at: nowIso(),
    status: input.status ?? 'new',
    ...input,
  };

  if (!supabase) return demoStore.insertLead(lead);

  const { data, error } = await supabase
    .from('leads')
    .insert({
      court_type: lead.court_type,
      court_size: lead.court_size,
      land_condition: lead.land_condition,
      full_name: lead.full_name,
      phone: lead.phone,
      email: lead.email,
      property_address: lead.property_address,
      estimated_min: lead.estimated_min,
      estimated_max: lead.estimated_max,
      city_slug: lead.city_slug,
      render_id: lead.render_id,
      status: lead.status,
      sms_consent: lead.sms_consent,
      sms_consent_at: lead.sms_consent_at,
      utm: lead.utm,
      fbc: lead.fbc,
      fbp: lead.fbp,
      source: lead.source,
    })
    .select('*')
    .single();

  if (error || !data) throw new Error(`createLead failed: ${error?.message}`);
  return data as Lead;
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const supabase = getServiceClient();
  if (!supabase) return demoStore.updateLead(id, patch) ?? null;
  const { data, error } = await supabase.from('leads').update(patch).eq('id', id).select('*').single();
  if (error) throw new Error(`updateLead failed: ${error.message}`);
  return (data as Lead) ?? null;
}

export async function listLeads(): Promise<Lead[]> {
  const supabase = getServiceClient();
  if (!supabase) return demoStore.listLeads();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) throw new Error(`listLeads failed: ${error.message}`);
  return (data as Lead[]) ?? [];
}

// ── Renders ─────────────────────────────────────────────────────────────────

export type NewRender = Omit<Render, 'id' | 'created_at'>;

export async function createRender(input: NewRender): Promise<Render> {
  const supabase = getServiceClient();
  const render: Render = { id: crypto.randomUUID(), created_at: nowIso(), ...input };
  if (!supabase) return demoStore.insertRender(render);
  const { data, error } = await supabase.from('renders').insert(input).select('*').single();
  if (error || !data) throw new Error(`createRender failed: ${error?.message}`);
  return data as Render;
}

export async function getRender(id: string): Promise<Render | null> {
  const supabase = getServiceClient();
  if (!supabase) return demoStore.getRender(id) ?? null;
  const { data, error } = await supabase.from('renders').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`getRender failed: ${error.message}`);
  return (data as Render) ?? null;
}

export async function updateRender(id: string, patch: Partial<Render>): Promise<Render | null> {
  const supabase = getServiceClient();
  if (!supabase) return demoStore.updateRender(id, patch) ?? null;
  const { data, error } = await supabase.from('renders').update(patch).eq('id', id).select('*').single();
  if (error) throw new Error(`updateRender failed: ${error.message}`);
  return (data as Render) ?? null;
}

export async function listRenders(): Promise<Render[]> {
  const supabase = getServiceClient();
  if (!supabase) return demoStore.listRenders();
  const { data, error } = await supabase.from('renders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(`listRenders failed: ${error.message}`);
  return (data as Render[]) ?? [];
}
