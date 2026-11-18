import { createFileRoute, Link } from "@tanstack/react-router";
import { packages } from "@/data/catalog";
import { PageIntro, Shell } from "@/components/shell";

export const Route = createFileRoute("/packages")({ component: PackagesPage });

function PackagesPage() {
  return (
    <Shell>
      <PageIntro
        kicker="تعرفه"
        title="عدد برای شروع گفتگو است"
        text="تعرفه شروع گفتگو است. پرداخت از میز کار، کارت‌به‌کارت به نام صاحب حساب، و پیام آماده در واتساپ یا بله."
      />
      <ul className="mx-auto grid max-w-6xl gap-4 px-4 pb-14 md:grid-cols-2">
        {packages.map((item) => (
          <li
            key={item.id}
            className={
              item.featured
                ? "rounded-2xl border border-wine bg-wine p-6 text-paper"
                : "rounded-2xl border border-line bg-card p-6"
            }
          >
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className={item.featured ? "mt-1 text-paper/80" : "mt-1 text-wine"}>{item.price}</p>
            <p className={item.featured ? "mt-3 text-paper/85" : "mt-3 text-muted"}>{item.line}</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link
              to="/request"
              search={{ package: item.id }}
              className={
                item.featured
                  ? "mt-6 inline-flex min-h-11 items-center rounded-full bg-paper px-5 font-medium text-wine"
                  : "mt-6 inline-flex min-h-11 items-center rounded-full bg-wine px-5 font-medium text-paper"
              }
            >
              درخواست این میز
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
