export type LeadStatus = "new" | "talk" | "pay" | "done";

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
  status: LeadStatus;
};

const KEY = "royalfam.leads.v1";

export function readLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Lead[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((lead) => ({ ...lead, status: lead.status ?? "new" }));
  } catch {
    return [];
  }
}

export function saveLead(input: Omit<Lead, "id" | "at" | "status">) {
  const next: Lead = {
    ...input,
    id: crypto.randomUUID(),
    at: Date.now(),
    status: "new",
  };
  const all = [next, ...readLeads()].slice(0, 40);
  localStorage.setItem(KEY, JSON.stringify(all));
  return next;
}

export function setLeadStatus(id: string, status: LeadStatus) {
  const all = readLeads().map((lead) => (lead.id === id ? { ...lead, status } : lead));
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearLeads() {
  localStorage.removeItem(KEY);
}
