import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { scopeForPath, wavePhrases, faNum } from "@/lib/seo";
import { usePulse, writeMeta } from "@/lib/pulse";

const NAV = [
  { to: "/", label: "خانه" },
  { to: "/coverage", label: "پوشش" },
  { to: "/services", label: "خدمات" },
  { to: "/directory", label: "دایرکتوری" },
  { to: "/pulse", label: "نبض سئو" },
  { to: "/packages", label: "تعرفه" },
  { to: "/request", label: "درخواست" },
] as const;

export function PulseEngine() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const apply = usePulse((state) => state.apply);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const slot = Math.floor(now / 100_000);
      const left = Math.ceil((100_000 - (now % 100_000)) / 1000);
      const scope = scopeForPath(pathname, slot);
      const phrases = wavePhrases(scope.service, scope.place, slot);
      writeMeta("keywords", phrases.join("، "));
      writeMeta("royalfam-wave", String(slot));
      writeMeta("royalfam-live-description", phrases.slice(0, 3).join(" — "));
      apply(slot, left, phrases[0] ?? "");
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [pathname, apply]);

  return null;
}

export function PulseStrip() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const slot = usePulse((state) => state.slot);
  const left = usePulse((state) => state.left);
  const ready = usePulse((state) => state.ready);
  const scope = scopeForPath(pathname, slot);
  const phrase = wavePhrases(scope.service, scope.place, slot)[0];
  const width = ready ? `${left}%` : "100%";

  return (
    <div className="border-b border-line bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm">
        <span className="shrink-0 font-semibold text-wine">نبض</span>
        <span className="min-w-0 flex-1 truncate text-muted">{phrase}</span>
        <span className="shrink-0 text-ink">{ready ? `${faNum(left)} ثانیه` : "هر ۱۰۰ ثانیه"}</span>
      </div>
      <div className="h-1 bg-line" aria-hidden="true">
        <div className="h-full bg-wine" style={{ width }} />
      </div>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <PulseEngine />
      <header className="sticky top-0 z-20 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-wine text-sm font-semibold tracking-wide text-paper">
              RF
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-bold">رویال فام</span>
              <span className="block text-sm text-muted">دفتر جذب مشتری محلی</span>
            </span>
          </Link>
          <nav className="ms-auto hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    active
                      ? "min-h-11 rounded-full bg-wine px-3 py-2 text-sm text-paper"
                      : "min-h-11 rounded-full px-3 py-2 text-sm text-ink"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="ms-auto grid size-11 place-items-center rounded-xl border border-line bg-card lg:hidden"
            aria-expanded={open}
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open ? (
          <nav className="border-t border-line px-4 py-3 lg:hidden">
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="flex min-h-11 items-center rounded-xl px-3 text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      <PulseStrip />
      <main>{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold">رویال فام</p>
            <p className="mt-2 text-sm text-muted">
              شبکهٔ مستقل جذب مشتری. اول سالن زیبایی، بعد کلینیک، بعد بقیهٔ خدمات محلی.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">پوشش</p>
            <p className="mt-2 text-sm text-muted">۲۲ منطقهٔ تهران، شهرستان‌های استان، ۳۱ استان، پنج شهر کانونی.</p>
          </div>
          <div>
            <p className="text-sm font-semibold">نت داخلی</p>
            <p className="mt-2 text-sm text-muted">فونت و صفحات روی خود سایت‌اند. برای دیده شدن به سرویس خارجی تکیه نمی‌کند.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/request" className="text-wine">
              ثبت درخواست
            </Link>
            <Link to="/pulse" className="text-wine">
              وضعیت موج سئو
            </Link>
            <Link to="/directory" className="text-wine">
              پیدا کردن صفحهٔ محلی
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function MissingPage() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-sm font-semibold text-wine">۴۰۴</p>
        <h1 className="mt-2 text-3xl font-bold">این صفحه در شبکه نیست</h1>
        <p className="mt-3 max-w-xl text-muted">آدرس را عوض کنید یا از دایرکتوری، منطقه و خدمت را دوباره انتخاب کنید.</p>
        <Link
          to="/directory"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-wine px-5 text-paper"
        >
          رفتن به دایرکتوری
        </Link>
      </section>
    </Shell>
  );
}

export function PageIntro({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-10 pb-6">
      <p className="text-sm font-semibold text-wine">{kicker}</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-bold text-balance sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted">{text}</p>
    </header>
  );
}
