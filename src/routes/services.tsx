import { createFileRoute, Link } from "@tanstack/react-router";
import { services, servicesOf, tierLabel } from "@/data/catalog";
import { PageIntro, Shell } from "@/components/shell";

type TierSearch = { tier: "all" | "1" | "2" | "3" };

export const Route = createFileRoute("/services")({
  validateSearch: (search: Record<string, unknown>): TierSearch => {
    const tier = search.tier;
    if (tier === "1" || tier === "2" || tier === "3") return { tier };
    return { tier: "all" };
  },
  component: ServicesPage,
});

function ServicesPage() {
  const { tier } = Route.useSearch();
  const list = tier === "all" ? services : servicesOf(Number(tier) as 1 | 2 | 3);
  const filters = [
    ["all", "همه"],
    ["1", tierLabel[1]],
    ["2", tierLabel[2]],
    ["3", tierLabel[3]],
  ] as const;

  return (
    <Shell>
      <PageIntro
        kicker="خدمات"
        title="اول زیبایی، بعد بقیهٔ بازار"
        text="دسته‌ها از نیاز جستجوی محلی آمده‌اند. سالن و کلینیک جلوترند چون رساندن مشتری آنجا فوری‌تر به نوبت تبدیل می‌شود."
      />
      <div className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex flex-wrap gap-2">
          {filters.map(([value, label]) => (
            <Link
              key={value}
              to="/services"
              search={{ tier: value }}
              className={
                tier === value
                  ? "inline-flex min-h-11 items-center rounded-full bg-wine px-4 text-sm text-paper"
                  : "inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 text-sm"
              }
            >
              {label}
            </Link>
          ))}
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {list.map((service) => (
            <li key={service.slug}>
              <Link to="/s/$service" params={{ service: service.slug }} className="block h-full rounded-2xl border border-line bg-card p-5">
                <span className="text-sm text-wine">{tierLabel[service.tier]}</span>
                <span className="mt-1 block text-xl font-semibold">{service.name}</span>
                <span className="mt-2 block text-sm text-muted">{service.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
