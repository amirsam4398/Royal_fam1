export type LeadRole = "business" | "customer";

export type Lead = {
  id: string;
  role: LeadRole;
  name: string;
  phone: string;
  place: string;
  service: string;
  packageId: string;
  note: string;
  at: number;
};

const KEY = "royalfam.leads.v1";

export function readLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLead(input: Omit<Lead, "id" | "at">) {
  const next: Lead = {
    ...input,
    id: crypto.randomUUID(),
    at: Date.now(),
  };
  const all = [next, ...readLeads()].slice(0, 40);
  localStorage.setItem(KEY, JSON.stringify(all));
  return next;
}

export function clearLeads() {
  localStorage.removeItem(KEY);
}
