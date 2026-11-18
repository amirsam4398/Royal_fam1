import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageIntro, Shell } from "@/components/shell";

type KeyReport = {
  fingerprint: string;
  algorithm: string;
};

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "امنیت رویال فام" },
      {
        name: "description",
        content: "وضعیت واقعی امنیت نامتقارن رویال فام و این‌که حفاظت پساکوانتومی هنوز روی سایت فعال نیست.",
      },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  const [report, setReport] = useState<KeyReport | null>(null);
  const [error, setError] = useState("");

  async function generate() {
    setError("");
    try {
      const pair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);
      const spki = await crypto.subtle.exportKey("spki", pair.publicKey);
      const digest = await crypto.subtle.digest("SHA-256", spki);
      const fingerprint = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
      setReport({ fingerprint, algorithm: "ECDH P-256" });
    } catch {
      setError("این مرورگر ساخت کلید نامتقارن را انجام نداد.");
    }
  }

  return (
    <Shell>
      <PageIntro
        kicker="امنیت"
        title="نامتقارن واقعی است، کوانتومی هنوز نه"
        text="کلید عمومی و خصوصی با WebCrypto همین مرورگر ساخته می‌شود. کلید خصوصی قابل استخراج نیست. این سایت الگوریتم پساکوانتومی مثل ML-KEM را اجرا نمی‌کند و چنین ادعایی ندارد."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-14 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">رمز نامتقارن</h2>
          <p className="mt-2 text-sm text-muted">
            در رمز نامتقارن دو کلید هست. کلید عمومی را می‌شود نشان داد. کلید خصوصی در همین صفحه می‌ماند و دکمهٔ استخراج ندارد.
          </p>
          <button type="button" className="mt-4 min-h-11 rounded-full bg-wine px-5 text-sm text-paper" onClick={generate}>
            ساخت جفت‌کلید روی همین دستگاه
          </button>
          {error ? <p className="mt-3 text-sm text-wine">{error}</p> : null}
          {report ? (
            <dl className="mt-4 grid gap-2 text-sm">
              <div>
                <dt className="text-muted">الگوریتم</dt>
                <dd>{report.algorithm}</dd>
              </div>
              <div>
                <dt className="text-muted">اثرانگشت کلید عمومی</dt>
                <dd className="break-all font-mono text-xs">{report.fingerprint}</dd>
              </div>
              <div>
                <dt className="text-muted">کلید خصوصی</dt>
                <dd>ساخته شد و غیرقابل استخراج است. نشان داده نمی‌شود.</dd>
              </div>
            </dl>
          ) : null}
        </section>
        <section className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">امنیت کوانتومی</h2>
          <p className="mt-2 text-sm text-muted">
            منحنی P-256 که همین آزمایش و بخش بزرگی از HTTPS امروز استفاده می‌کند، در برابر رایانهٔ کوانتومی بزرگِ آینده مقاوم دانسته نمی‌شود. تا وقتی الگوریتم پساکوانتومی روی سرور و مرورگر هر دو فعال نشده باشد، برچسب «امنیت کوانتومی» برای این سایت نادرست است.
          </p>
          <p className="mt-3 text-sm text-muted">
            کد منبع سایت روی صفحهٔ عمومی برای دانلود گذاشته نمی‌شود. اسکریپتی که مرورگر برای نمایش صفحه می‌گیرد قابل پنهان‌کردن کامل نیست؛ وگرنه خود صفحه باز نمی‌شد.
          </p>
        </section>
      </div>
    </Shell>
  );
}
