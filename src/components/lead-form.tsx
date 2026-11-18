import { useEffect, useState } from "react";
import { packages, places, services } from "@/data/catalog";
import { clearLeads, readLeads, saveLead, type Lead, type LeadRole } from "@/lib/leads";
import { faRaw } from "@/lib/seo";

const field =
  "min-h-11 w-full rounded-xl border border-line bg-card px-3 text-ink outline-none";

export function LeadForm({
  initialPlace = "",
  initialService = "",
  initialPackage = "local",
  initialRole = "business",
}: {
  initialPlace?: string;
  initialService?: string;
  initialPackage?: string;
  initialRole?: LeadRole;
}) {
  const [role, setRole] = useState<LeadRole>(initialRole);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState(initialPlace || places[0]?.slug || "");
  const [service, setService] = useState(initialService || services[0]?.slug || "");
  const [packageId, setPackageId] = useState(initialPackage);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLeads(readLeads());
    setReady(true);
  }, []);

  function refresh() {
    setLeads(readLeads());
    setReady(true);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    const digits = phone.replace(/\D/g, "");
    if (trimmed.length < 2) {
      setError("نام را کامل‌تر بنویسید.");
      return;
    }
    if (!/^09\d{9}$/.test(digits)) {
      setError("شماره را با ۰۹ و یازده رقم بنویسید.");
      return;
    }
    saveLead({
      role,
      name: trimmed,
      phone: digits,
      place,
      service,
      packageId,
      note: note.trim(),
    });
    setName("");
    setPhone("");
    setNote("");
    setError("");
    refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <form className="grid gap-4 lg:col-span-3" onSubmit={onSubmit}>
        <fieldset className="grid grid-cols-2 gap-2">
          <legend className="sr-only">نقش</legend>
          {(
            [
              ["business", "صاحب کسب‌وکار"],
              ["customer", "مشتری خدمات"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={
                role === value
                  ? "min-h-11 rounded-xl bg-wine px-3 text-paper"
                  : "min-h-11 rounded-xl border border-line bg-card px-3 text-ink"
              }
            >
              {label}
            </button>
          ))}
        </fieldset>
        <label className="grid gap-1 text-sm">
          نام
          <input className={field} value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="grid gap-1 text-sm">
          موبایل
          <input
            className={field}
            inputMode="numeric"
            autoComplete="tel"
            placeholder="۰۹۱۲xxxxxxx"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          منطقه یا شهر
          <select className={field} value={place} onChange={(event) => setPlace(event.target.value)}>
            {places.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          خدمت
          <select className={field} value={service} onChange={(event) => setService(event.target.value)}>
            {services.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          تعرفهٔ مورد نظر
          <select className={field} value={packageId} onChange={(event) => setPackageId(event.target.value)}>
            {packages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          توضیح
          <textarea
            className={`${field} min-h-28 py-3`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={role === "business" ? "مثلاً سالن در ونک، دنبال نوبت رنگ و کاشت" : "مثلاً لیزر در منطقه ۵، این هفته"}
          />
        </label>
        {error ? <p className="text-sm text-wine">{error}</p> : null}
        <button type="submit" className="min-h-11 rounded-full bg-wine px-5 font-medium text-paper">
          ثبت روی همین دستگاه
        </button>
        <p className="text-sm text-muted">
          درخواست روی همین دستگاه در میز کار می‌ماند. کارت‌به‌کارت و متن واتساپ یا بله از همان میز ارسال می‌شود.
        </p>
      </form>
      <aside className="lg:col-span-2">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">درخواست‌های این دستگاه</h2>
          {!ready ? <p className="mt-3 text-sm text-muted">در حال خواندن…</p> : null}
          {ready && leads.length === 0 ? (
            <p className="mt-3 text-sm text-muted">هنوز درخواستی ثبت نشده.</p>
          ) : null}
          <ul className="mt-4 grid gap-3">
            {leads.map((lead) => {
              const placeName = places.find((item) => item.slug === lead.place)?.name ?? lead.place;
              const serviceName = services.find((item) => item.slug === lead.service)?.name ?? lead.service;
              return (
                <li key={lead.id} className="border-t border-line pt-3 text-sm">
                  <p className="font-medium">
                    {lead.role === "business" ? "کسب‌وکار" : "مشتری"} · {lead.name}
                  </p>
                  <p className="text-muted">
                    {serviceName} در {placeName}
                  </p>
                  <p className="text-muted">{faRaw(lead.phone)}</p>
                </li>
              );
            })}
          </ul>
          {ready && leads.length > 0 ? (
            <button
              type="button"
              className="mt-4 min-h-11 text-sm text-wine"
              onClick={() => {
                clearLeads();
                refresh();
              }}
            >
              پاک کردن فهرست این دستگاه
            </button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
