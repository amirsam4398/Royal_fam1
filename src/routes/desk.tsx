import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { packages, places, services } from "@/data/catalog";
import { PageIntro, Shell } from "@/components/shell";
import { readLeads, setLeadStatus, type Lead, type LeadStatus } from "@/lib/leads";
import { baleLink, PAY, paymentText, readOwnerLine, saveOwnerLine, waLink } from "@/lib/pay";
import { faRaw } from "@/lib/seo";
import { studioPack } from "@/lib/studio";

type DeskTab = "crm" | "pay" | "studio";

const STATUSES: { id: LeadStatus; label: string }[] = [
  { id: "new", label: "جدید" },
  { id: "talk", label: "در گفتگو" },
  { id: "pay", label: "منتظر واریز" },
  { id: "done", label: "تسویه شد" },
];

export const Route = createFileRoute("/desk")({
  validateSearch: (search: Record<string, unknown>): { tab?: DeskTab } => {
    const result: { tab?: DeskTab } = {};
    if (search.tab === "pay" || search.tab === "studio" || search.tab === "crm") {
      result.tab = search.tab;
    }
    return result;
  },
  head: () => ({
    meta: [
      { title: "میز کار رویال فام | سی‌آرام، پرداخت و سئو" },
      {
        name: "description",
        content:
          "میز داخلی رویال فام برای پیگیری درخواست، کارت‌به‌کارت و متن سئو و اینستاگرام مشتری.",
      },
    ],
  }),
  component: DeskPage,
});

function DeskPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const tab = search.tab ?? "crm";
  return (
    <Shell>
      <PageIntro
        kicker={PAY.brand}
        title="میز کار داخلی"
        text="درخواست‌ها، کارت‌به‌کارت و متن پیج اینستاگرام اینجاست. ساختار صفحات محلی همان است. ارسال واتساپ و بله با تأیید شما باز می‌شود، چون پیام‌رسان بدون اتصال رسمی، رباتِ پنهان اجازه نمی‌دهد."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-14">
        <p className="rounded-2xl border border-line bg-card px-4 py-3 text-sm">
          کارت‌به‌کارت {PAY.cardGrouped} به‌نام {PAY.holder}
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["crm", "سی‌آرام"],
              ["pay", "کارت‌به‌کارت"],
              ["studio", "سئو و اینستاگرام"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={
                tab === id
                  ? "min-h-11 rounded-full bg-wine px-4 text-sm text-paper"
                  : "min-h-11 rounded-full border border-line bg-card px-4 text-sm"
              }
              onClick={() => navigate({ search: { tab: id } })}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "crm" ? <CrmPane /> : null}
        {tab === "pay" ? <PayPane /> : null}
        {tab === "studio" ? <StudioPane /> : null}
      </div>
    </Shell>
  );
}

function CrmPane() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ready, setReady] = useState(false);

  function refresh() {
    setLeads(readLeads());
    setReady(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <section className="grid gap-3">
      {!ready ? <p className="text-sm text-muted">در حال خواندن میز…</p> : null}
      {ready && leads.length === 0 ? (
        <p className="rounded-2xl border border-line bg-card p-5 text-sm text-muted">
          هنوز درخواستی روی این دستگاه نیست. از صفحهٔ درخواست ثبت کنید تا اینجا در صف بیفتد.
        </p>
      ) : null}
      {leads.map((lead) => (
        <LeadRow
          key={lead.id}
          lead={lead}
          onStatus={(status) => {
            setLeadStatus(lead.id, status);
            refresh();
          }}
        />
      ))}
    </section>
  );
}

function LeadRow({ lead, onStatus }: { lead: Lead; onStatus: (status: LeadStatus) => void }) {
  const placeName = places.find((item) => item.slug === lead.place)?.name ?? lead.place;
  const serviceName = services.find((item) => item.slug === lead.service)?.name ?? lead.service;
  const pack = packages.find((item) => item.id === lead.packageId);
  const text = paymentText({
    name: lead.name,
    subject: `${serviceName} در ${placeName}`,
    amount: pack?.price ?? "",
  });
  return (
    <article className="rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">
          {lead.role === "business" ? "کسب‌وکار" : "مشتری"} · {lead.name}
        </h2>
        <p className="text-sm text-muted">{faRaw(lead.phone)}</p>
      </div>
      <p className="mt-1 text-sm text-muted">
        {serviceName} در {placeName}
        {pack ? ` · ${pack.name}` : ""}
      </p>
      {lead.note ? <p className="mt-2 text-sm">{lead.note}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {STATUSES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              (lead.status ?? "new") === item.id
                ? "min-h-11 rounded-full bg-wine px-3 text-sm text-paper"
                : "min-h-11 rounded-full border border-line px-3 text-sm"
            }
            onClick={() => onStatus(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm text-paper"
          href={waLink(lead.phone, text)}
          target="_blank"
          rel="noreferrer"
        >
          واتساپ همین شماره
        </a>
        <a
          className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm"
          href={baleLink(text)}
          target="_blank"
          rel="noreferrer"
        >
          بله
        </a>
        <CopyButton text={text} />
      </div>
    </article>
  );
}

function PayPane() {
  const [line, setLine] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("میز اینستاگرام و سئو محلی");
  const [amount, setAmount] = useState("طبق گفتگو");
  const [ready, setReady] = useState(false);
  const text = useMemo(
    () => paymentText({ name, subject, amount }),
    [name, subject, amount],
  );

  useEffect(() => {
    setLine(readOwnerLine());
    setReady(true);
  }, []);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-wine bg-wine p-6 text-paper">
        <p className="text-sm">کارت‌به‌کارت</p>
        <p className="mt-3 text-2xl font-bold tracking-wide">{PAY.cardGrouped}</p>
        <p className="mt-2">به‌نام {PAY.holder}</p>
        <p className="mt-4 text-sm text-paper/80">{PAY.brand}</p>
        <p className="text-sm text-paper/80">{PAY.claim}</p>
      </div>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          saveOwnerLine(line);
          setLine(readOwnerLine());
        }}
      >
        <label className="grid gap-1 text-sm">
          شمارهٔ خط صاحب میز برای رونوشت
          <input
            className="min-h-11 rounded-xl border border-line bg-card px-3"
            inputMode="numeric"
            value={line}
            onChange={(event) => setLine(event.target.value)}
            placeholder="۰۹۱۲xxxxxxx"
          />
        </label>
        <label className="grid gap-1 text-sm">
          نام پرداخت‌کننده
          <input
            className="min-h-11 rounded-xl border border-line bg-card px-3"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          بابت
          <input
            className="min-h-11 rounded-xl border border-line bg-card px-3"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          مبلغ
          <input
            className="min-h-11 rounded-xl border border-line bg-card px-3"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <button type="submit" className="min-h-11 rounded-full border border-line px-4 text-sm">
          ذخیرهٔ خط روی همین دستگاه
        </button>
        {ready ? (
          <div className="flex flex-wrap gap-2">
            <a
              className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm text-paper"
              href={waLink(line, text)}
              target="_blank"
              rel="noreferrer"
            >
              باز کردن واتساپ
            </a>
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm"
              href={baleLink(text)}
              target="_blank"
              rel="noreferrer"
            >
              باز کردن بله
            </a>
            <CopyButton text={text} />
          </div>
        ) : null}
        <pre className="whitespace-pre-wrap rounded-2xl border border-line bg-card p-4 text-sm">{text}</pre>
      </form>
    </section>
  );
}

function StudioPane() {
  const [name, setName] = useState("");
  const [place, setPlace] = useState(places[0]?.name ?? "");
  const [service, setService] = useState(services[0]?.name ?? "");
  const [handle, setHandle] = useState("");
  const pack = studioPack({ name, place, service, handle });
  const block = [
    `عنوان: ${pack.title}`,
    `توضیح: ${pack.description}`,
    `کلیدواژه‌ها: ${pack.keywords.join("، ")}`,
    `بایو:\n${pack.bio}`,
    `کپشن:\n${pack.caption}`,
  ].join("\n\n");

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <label className="grid gap-1 text-sm">
          نام کسب‌وکار مشتری
          <input
            className="min-h-11 rounded-xl border border-line bg-card px-3"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          شهر یا منطقه
          <input
            className="min-h-11 rounded-xl border border-line bg-card px-3"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          خدمت
          <input
            className="min-h-11 rounded-xl border border-line bg-card px-3"
            value={service}
            onChange={(event) => setService(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          آیدی اینستاگرام
          <input
            className="min-h-11 rounded-xl border border-line bg-card px-3"
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="بدون @"
          />
        </label>
        <CopyButton text={block} />
      </form>
      <div className="grid gap-3 text-sm">
        <article className="rounded-2xl border border-line bg-card p-4">
          <h2 className="font-semibold">متای صفحه</h2>
          <p className="mt-2">{pack.title}</p>
          <p className="mt-2 text-muted">{pack.description}</p>
          <p className="mt-2 text-muted">{pack.keywords.join("، ")}</p>
        </article>
        <article className="rounded-2xl border border-line bg-card p-4">
          <h2 className="font-semibold">پیج اینستاگرام</h2>
          <pre className="mt-2 whitespace-pre-wrap">{pack.bio}</pre>
          <pre className="mt-3 whitespace-pre-wrap">{pack.caption}</pre>
          <p className="mt-3 text-muted">{pack.tags.join(" ")}</p>
        </article>
        <article className="rounded-2xl border border-line bg-card p-4">
          <h2 className="font-semibold">برنامهٔ هفته</h2>
          <ul className="mt-2 grid gap-1">
            {pack.week.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="min-h-11 rounded-full border border-line px-4 text-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
        } catch {
          setDone(false);
        }
      }}
    >
      {done ? "کپی شد" : "کپی متن"}
    </button>
  );
}
