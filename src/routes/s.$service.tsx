import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, kindLabel, placesOf, tierLabel, type PlaceKind } from "@/data/catalog";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/s/$service")({
  loader: ({ params }) => {
    const service = getService(params.service);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    return {
      meta: [
        { title: `${loaderData.service.name} | رویال فام` },
        {
          name: "description",
          content: `${loaderData.service.name} در مناطق تهران، شهرستان‌ها، استان‌ها و شهرهای کانونی. ${loaderData.service.line}`,
        },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { service } = Route.useLoaderData();
  const kinds: PlaceKind[] = ["district", "county", "province", "metro"];
  return (
    <Shell>
      <article className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold text-wine">{tierLabel[service.tier]}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{service.name}</h1>
        <p className="mt-3 max-w-2xl text-muted">{service.line}</p>
        <Link
          to="/request"
          search={{ service: service.slug, role: "business" }}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-wine px-5 text-paper"
        >
          می‌خواهم برای این خدمت مشتری بیاید
        </Link>
        <div className="mt-10 grid gap-8">
          {kinds.map((kind) => (
            <section key={kind}>
              <h2 className="text-xl font-semibold">{kindLabel[kind]}</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {placesOf(kind).map((place) => (
                  <li key={place.slug}>
                    <Link
                      to="/p/$place/$service"
                      params={{ place: place.slug, service: service.slug }}
                      className="flex min-h-11 items-center rounded-xl border border-line bg-card px-3 text-sm"
                    >
                      {service.name} در {place.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>
    </Shell>
  );
}
