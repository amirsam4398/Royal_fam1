import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPlace, servicesOf, tierLabel } from "@/data/catalog";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/p/$place/")({
  loader: ({ params }) => {
    const place = getPlace(params.place);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { place } = loaderData;
    return {
      meta: [
        { title: `تبلیغات محلی ${place.name} | رویال فام` },
        {
          name: "description",
          content: `صفحات جذب مشتری در ${place.name}: ${place.areas.join("، ")}. اولویت با سالن و کلینیک زیبایی.`,
        },
      ],
    };
  },
  component: PlacePage,
});

function PlacePage() {
  const { place } = Route.useLoaderData();
  return (
    <Shell>
      <article className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold text-wine">{place.group}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{place.name}</h1>
        <p className="mt-3 max-w-2xl text-muted">{place.line}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {place.areas.map((area) => (
            <li key={area} className="rounded-full border border-line bg-card px-3 py-2 text-sm">
              {area}
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-8">
          {([1, 2, 3] as const).map((tier) => (
            <section key={tier}>
              <h2 className="text-xl font-semibold">{tierLabel[tier]}</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {servicesOf(tier).map((service) => (
                  <li key={service.slug}>
                    <Link
                      to="/p/$place/$service"
                      params={{ place: place.slug, service: service.slug }}
                      className="block rounded-xl border border-line bg-card px-4 py-3"
                    >
                      <span className="block font-medium">{service.name}</span>
                      <span className="block text-sm text-muted">{service.line}</span>
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
