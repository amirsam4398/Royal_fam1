import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { kindLabel, places, services, tierLabel, type PlaceKind } from "@/data/catalog";
import { PageIntro, Shell } from "@/components/shell";

export const Route = createFileRoute("/directory")({ component: DirectoryPage });

const field = "min-h-11 w-full rounded-xl border border-line bg-card px-3 text-ink";

function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<0 | 1 | 2 | 3>(1);
  const [placeSlug, setPlaceSlug] = useState(places[0]?.slug ?? "");

  const placeOptions = useMemo(() => {
    const q = query.trim();
    if (!q) return places;
    return places.filter(
      (place) => place.name.includes(q) || place.areas.some((area) => area.includes(q)) || place.group.includes(q),
    );
  }, [query]);

  const serviceHits = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return services.filter(
      (service) => service.name.includes(q) || service.family.includes(q) || service.line.includes(q),
    );
  }, [query]);

  const serviceOptions = useMemo(() => {
    if (query.trim() && serviceHits.length > 0) return serviceHits;
    return services.filter((service) => tier === 0 || service.tier === tier);
  }, [query, serviceHits, tier]);

  const locationChoices = query.trim() && placeOptions.length > 0 ? placeOptions : places;
  const place = locationChoices.find((item) => item.slug === placeSlug) ?? locationChoices[0];
  const nothing = query.trim().length > 0 && placeOptions.length === 0 && serviceHits.length === 0;

  return (
    <Shell>
      <PageIntro
        kicker="دایرکتوری"
        title="منطقه را بردارید، خدمت را باز کنید"
        text="هزاران ترکیب اینجاست، ولی همه با هم روی صفحه ریخته نمی‌شوند. یک نقطه را انتخاب کنید تا ویترین همان‌جا بیاید."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-14 lg:grid-cols-12">
        <div className="grid gap-4 lg:col-span-4">
          <label className="grid gap-1 text-sm">
            جستجو
            <input
              className={field}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ونک، لیزر، مشهد…"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                [1, "سالن"],
                [2, "کلینیک"],
                [3, "سایر"],
                [0, "همه"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTier(value)}
                className={
                  tier === value
                    ? "min-h-11 rounded-full bg-wine px-4 text-sm text-paper"
                    : "min-h-11 rounded-full border border-line bg-card px-4 text-sm"
                }
              >
                {label}
              </button>
            ))}
          </div>
          <label className="grid gap-1 text-sm">
            نقطه
            <select
              className={field}
              value={place?.slug ?? ""}
              onChange={(event) => setPlaceSlug(event.target.value)}
            >
              {(["district", "county", "province", "metro"] as PlaceKind[]).map((kind) => {
                const group = locationChoices.filter((item) => item.kind === kind);
                if (group.length === 0) return null;
                return (
                  <optgroup key={kind} label={kindLabel[kind]}>
                    {group.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </label>
        </div>
        <div className="lg:col-span-8">
          {nothing ? (
            <p className="text-muted">با این عبارت نه منطقه‌ای ماند و نه خدمتی. کلمه را کوتاه‌تر کنید.</p>
          ) : place ? (
            <>
              <h2 className="text-2xl font-bold">{place.name}</h2>
              <p className="mt-1 text-sm text-muted">{place.areas.join("، ")}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {serviceOptions.map((service) => (
                  <li key={service.slug}>
                    <Link
                      to="/p/$place/$service"
                      params={{ place: place.slug, service: service.slug }}
                      className="block h-full rounded-2xl border border-line bg-card p-4"
                    >
                      <span className="text-sm text-wine">{tierLabel[service.tier]}</span>
                      <span className="mt-1 block font-semibold">{service.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {serviceOptions.length === 0 ? (
                <p className="mt-4 text-muted">با این جستجو خدمتی نماند. کلمه را کوتاه‌تر کنید.</p>
              ) : null}
            </>
          ) : (
            <p className="text-muted">منطقه‌ای با این نام پیدا نشد.</p>
          )}
        </div>
      </div>
    </Shell>
  );
}
