import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPlace, getService, relatedServices, siblingPlaces, tierLabel } from "@/data/catalog";
import { Shell } from "@/components/shell";
import { usePulse } from "@/lib/pulse";
import { landingCopy, pageSeo, wavePhrases } from "@/lib/seo";

export const Route = createFileRoute("/p/$place/$service")({
  loader: ({ params }) => {
    const place = getPlace(params.place);
    const service = getService(params.service);
    if (!place || !service) throw notFound();
    return { place, service, seo: pageSeo(service, place) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    return {
      meta: [
        { title: loaderData.seo.title },
        { name: "description", content: loaderData.seo.description },
        { name: "keywords", content: loaderData.seo.keywords },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
  component: LandingPage,
});

function LandingPage() {
  const { place, service, seo } = Route.useLoaderData();
  const slot = usePulse((state) => state.slot);
  const phrases = wavePhrases(service, place, slot);
  const copy = landingCopy(service, place);
  const json = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} در ${place.name}`,
    description: seo.description,
    serviceType: service.family,
    areaServed: {
      "@type": "Place",
      name: place.name,
    },
    provider: {
      "@type": "Organization",
      name: "رویال فام",
    },
  };

  return (
    <Shell>
      <article className="mx-auto max-w-6xl px-4 py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
        <nav className="flex flex-wrap gap-2 text-sm text-muted">
          <Link to="/" className="text-wine">
            خانه
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/p/$place" params={{ place: place.slug }} className="text-wine">
            {place.name}
          </Link>
          <span aria-hidden="true">/</span>
          <span>{service.name}</span>
        </nav>
        <p className="mt-6 text-sm font-semibold text-wine">
          {tierLabel[service.tier]} · {place.group}
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold text-balance sm:text-4xl">
          {service.name} در {place.name}
        </h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-5">
          <div className="grid gap-4 lg:col-span-3">
            {copy.map((paragraph) => (
              <p key={paragraph} className="text-ink">
                {paragraph}
              </p>
            ))}
            <h2 className="pt-2 text-lg font-semibold">خوشهٔ این موج</h2>
            <ul className="flex flex-wrap gap-2">
              {phrases.map((phrase) => (
                <li key={phrase} className="rounded-full border border-line bg-card px-3 py-2 text-sm">
                  {phrase}
                </li>
              ))}
            </ul>
          </div>
          <aside className="grid h-fit gap-3 rounded-2xl border border-line bg-card p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold">همین صفحه را به نوبت وصل کنید</h2>
            <p className="text-sm text-muted">محله‌های پوشش: {place.areas.join("، ")}</p>
            <Link
              to="/request"
              search={{ place: place.slug, service: service.slug, role: "business", package: "local" }}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-4 text-paper"
            >
              صاحب کسب‌وکارم
            </Link>
            <Link
              to="/request"
              search={{ place: place.slug, service: service.slug, role: "customer", package: "local" }}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-4"
            >
              مشتری این خدمتم
            </Link>
          </aside>
        </div>
        <section className="mt-12">
          <h2 className="text-xl font-semibold">خدمت‌های نزدیک</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {relatedServices(service).map((item) => (
              <li key={item.slug}>
                <Link
                  to="/p/$place/$service"
                  params={{ place: place.slug, service: item.slug }}
                  className="flex min-h-11 items-center rounded-xl border border-line bg-card px-4"
                >
                  {item.name} در {place.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-semibold">نقطه‌های هم‌خانواده</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {siblingPlaces(place).map((item) => (
              <li key={item.slug}>
                <Link
                  to="/p/$place/$service"
                  params={{ place: item.slug, service: service.slug }}
                  className="flex min-h-11 items-center rounded-xl border border-line bg-card px-4"
                >
                  {service.name} در {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </Shell>
  );
}
