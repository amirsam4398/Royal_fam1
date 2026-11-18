import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageIntro, Shell } from "@/components/shell";
import { analyzeSwot, LEVEL_LABEL, type RivalLevel } from "@/lib/swot";
import { faNum, faRaw } from "@/lib/seo";

const LEVELS: RivalLevel[] = [
  "local",
  "local",
  "local",
  "local",
  "province",
  "province",
  "province",
  "country",
  "country",
  "country",
];

const field = "min-h-11 w-full rounded-xl border border-line bg-card px-3 text-ink";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "تحلیل پیج و سایت مشتری | رویال فام" },
      {
        name: "description",
        content: "تحلیل سوات پیج اینستاگرام و سایت مشتری در برابر ده رقیب محلی، استانی و کشوری، با نموداری که از عددهای واردشده ساخته می‌شود.",
      },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const [handle, setHandle] = useState("");
  const [site, setSite] = useState("");
  const [followers, setFollowers] = useState("");
  const [likes, setLikes] = useState("");
  const [posts, setPosts] = useState("");
  const [visits, setVisits] = useState("");
  const [rivals, setRivals] = useState(() =>
    LEVELS.map((level) => ({ name: "", level, followers: "", site: "" })),
  );

  const report = useMemo(() => {
    return analyzeSwot({
      followers: num(followers),
      likes: num(likes),
      postsPerWeek: num(posts),
      visits: num(visits),
      rivals: rivals.map((rival) => ({
        name: rival.name,
        level: rival.level,
        followers: num(rival.followers),
        site: rival.site,
      })),
    });
  }, [followers, likes, posts, visits, rivals]);

  const bars = [
    { name: handle.trim() || "پیج مشتری", value: num(followers), mine: true },
    ...report.known.map((rival) => ({ name: rival.name, value: rival.followers, mine: false })),
  ];
  const max = Math.max(1, ...bars.map((bar) => bar.value));

  return (
    <Shell>
      <PageIntro
        kicker="تحلیل"
        title="سوات پیج و سایت، در برابر ده رقیب"
        text="اینستاگرام از اینجا خوانده نمی‌شود. نمودار فقط از عددی رسم می‌شود که خودتان از پیج مشتری، سایتش و ده رقیب محلی، استانی و کشوری وارد کنید. عدد ساختگی در نمودار نیست."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 lg:grid-cols-2">
        <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
          <label className="grid gap-1 text-sm">
            آیدی اینستاگرام مشتری
            <input className={field} value={handle} onChange={(event) => setHandle(event.target.value)} placeholder="بدون @" />
          </label>
          <label className="grid gap-1 text-sm">
            سایت مشتری
            <input className={field} value={site} onChange={(event) => setSite(event.target.value)} placeholder="https://" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <Num label="دنبال‌کننده" value={followers} onChange={setFollowers} />
            <Num label="میانگین لایک آخرین پست‌ها" value={likes} onChange={setLikes} />
            <Num label="پست در هفته" value={posts} onChange={setPosts} />
            <Num label="بازدید ماهانهٔ سایت" value={visits} onChange={setVisits} />
          </div>
          <div className="grid gap-3">
            {rivals.map((rival, index) => (
              <div key={index} className="grid gap-2 rounded-2xl border border-line bg-card p-3">
                <p className="text-sm font-semibold">
                  رقیب {faRaw(index + 1)} · {LEVEL_LABEL[rival.level]}
                </p>
                <input
                  className={field}
                  value={rival.name}
                  placeholder="نام پیج یا برند"
                  onChange={(event) => updateRival(index, { name: event.target.value })}
                />
                <input
                  className={field}
                  value={rival.site}
                  placeholder="سایت رقیب"
                  onChange={(event) => updateRival(index, { site: event.target.value })}
                />
                <input
                  className={field}
                  inputMode="numeric"
                  value={rival.followers}
                  placeholder="دنبال‌کننده"
                  onChange={(event) => updateRival(index, { followers: event.target.value })}
                />
              </div>
            ))}
          </div>
        </form>
        <div className="grid gap-4 self-start">
          <section className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-semibold">نمودار دنبال‌کننده</h2>
            <p className="mt-1 text-sm text-muted">
              نرخ تعامل: {faNum(Math.round(report.rate * 10) / 10)} درصد
              {site.trim() ? ` · سایت: ${site.trim()}` : ""}
            </p>
            {num(followers) <= 0 && report.known.length === 0 ? (
              <p className="mt-4 text-sm text-muted">با وارد کردن عدد، میله‌ها رسم می‌شوند.</p>
            ) : (
              <ul className="mt-4 grid gap-3">
                {bars.map((bar) => (
                  <li key={`${bar.name}-${bar.value}`}>
                    <div className="mb-1 flex justify-between gap-3 text-sm">
                      <span className="truncate">{bar.name}</span>
                      <span className="text-muted">{faNum(bar.value)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-line">
                      <div
                        className={bar.mine ? "h-3 rounded-full bg-wine" : "h-3 rounded-full bg-gold"}
                        style={{ width: `${Math.max(4, (bar.value / max) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-semibold">نمودار سوات</h2>
            <ul className="mt-4 grid gap-3">
              {report.scores.map((score) => (
                <li key={score.key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>
                      {score.key} · {score.label}
                    </span>
                    <span>{faNum(score.value)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-line">
                    <div className="h-3 rounded-full bg-wine" style={{ width: `${score.value}%` }} />
                  </div>
                  <p className="mt-1 text-sm text-muted">{score.note}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Shell>
  );

  function updateRival(index: number, patch: Partial<(typeof rivals)[number]>) {
    setRivals((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }
}

function Num({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input className={field} inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function num(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
