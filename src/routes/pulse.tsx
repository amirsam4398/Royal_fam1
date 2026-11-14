import { createFileRoute, Link } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { landingCount } from "@/data/catalog";
import { PageIntro, Shell } from "@/components/shell";
import { usePulse } from "@/lib/pulse";
import { bankParts, faNum, faRaw, scopeForPath, wavePhrases } from "@/lib/seo";

export const Route = createFileRoute("/pulse")({ component: PulsePage });

function PulsePage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const slot = usePulse((state) => state.slot);
  const left = usePulse((state) => state.left);
  const ready = usePulse((state) => state.ready);
  const log = usePulse((state) => state.log);
  const scope = scopeForPath(pathname, slot);
  const phrases = wavePhrases(scope.service, scope.place, slot);
  const parts = bankParts();

  return (
    <Shell>
      <PageIntro
        kicker="نبض سئو"
        title="هر ۱۰۰ ثانیه لایهٔ زنده عوض می‌شود"
        text="عنوان و توضیح اصلی هر صفحه ثابت می‌ماند تا موتور جستجو همان آدرس را بشناسد. چیزی که هر ۱۰۰ ثانیه تازه می‌شود کلیدواژه و توضیح تکمیلی همان صفحه است."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-14 lg:grid-cols-5">
        <section className="rounded-2xl border border-line bg-card p-6 lg:col-span-3">
          <p className="text-sm text-muted">مانده تا موج بعد</p>
          <p className="mt-2 text-5xl font-bold text-wine">{ready ? faNum(left) : "—"}</p>
          <p className="mt-2 text-sm text-muted">شمارهٔ موج: {ready ? faNum(slot) : "در حال هم‌گام شدن"}</p>
          <h2 className="mt-6 text-lg font-semibold">
            این موج برای {scope.service.name} در {scope.place.name}
          </h2>
          <ul className="mt-3 grid gap-2">
            {phrases.map((phrase) => (
              <li key={phrase} className="rounded-xl border border-line px-3 py-2 text-sm">
                {phrase}
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid gap-3 text-sm">
            <div>
              <dt className="text-muted">meta keywords</dt>
              <dd className="mt-1 break-words">{phrases.join("، ")}</dd>
            </div>
            <div>
              <dt className="text-muted">meta royalfam-live-description</dt>
              <dd className="mt-1 break-words">{phrases.slice(0, 3).join(" — ")}</dd>
            </div>
          </dl>
        </section>
        <aside className="grid gap-4 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-semibold">بانک عبارت</h2>
            <p className="mt-2 text-3xl font-bold text-wine">{faNum(parts.total)}</p>
            <ul className="mt-3 grid gap-1 text-sm text-muted">
              <li>ترکیب قصد جستجو: {faNum(parts.intent)}</li>
              <li>ترکیب پسوند تجاری: {faNum(parts.suffix)}</li>
              <li>ترکیب محله: {faNum(parts.area)}</li>
              <li>
                از {faNum(parts.services)} خدمت و {faNum(parts.places)} نقطه
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted">
              این عدد حجم صفحه نیست. هر صفحه فقط خوشهٔ خودش را نشان می‌دهد تا به اسپم تبدیل نشود.
            </p>
          </section>
          <section className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-semibold">دفتر موج‌ها</h2>
            {log.length === 0 ? <p className="mt-2 text-sm text-muted">اولین موج تا چند لحظهٔ دیگر ثبت می‌شود.</p> : null}
            <ul className="mt-3 grid gap-3">
              {log.map((item) => (
                <li key={`${item.slot}-${item.at}`} className="text-sm">
                  <span className="text-muted">موج {faNum(item.slot)} · {faRaw(new Date(item.at).toLocaleTimeString("fa-IR"))}</span>
                  <span className="mt-1 block">{item.line}</span>
                </li>
              ))}
            </ul>
          </section>
          <p className="text-sm text-muted">
            {faNum(landingCount)} صفحهٔ محلی از ترکیب نقطه‌ها و خدمت‌ها ساخته می‌شود.{" "}
            <Link to="/directory" className="text-wine">
              از دایرکتوری بازشان کنید
            </Link>
            .
          </p>
        </aside>
      </div>
    </Shell>
  );
}
