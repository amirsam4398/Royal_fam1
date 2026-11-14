import { createFileRoute, Link } from "@tanstack/react-router";
import { placesOf, type PlaceKind } from "@/data/catalog";
import { PageIntro, Shell } from "@/components/shell";
import { faNum } from "@/lib/seo";

export const Route = createFileRoute("/coverage")({ component: CoveragePage });

const groups: { kind: PlaceKind; title: string; text: string }[] = [
  {
    kind: "district",
    title: "۲۲ منطقهٔ تهران",
    text: "هر منطقه با محله‌های شناخته‌شده‌اش. جستجوی «ونک» و «منطقه ۳» هر دو به همین شبکه می‌رسند.",
  },
  {
    kind: "county",
    title: "شهرستان‌های استان تهران",
    text: "بیرون از مناطق ۲۲گانه: از شهریار و پردیس تا فیروزکوه. شهر تهران خودش در فهرست مناطق است.",
  },
  {
    kind: "province",
    title: "۳۱ استان",
    text: "صفحهٔ استانی برای کسب‌وکاری که فراتر از یک محله مشتری می‌گیرد.",
  },
  {
    kind: "metro",
    title: "پنج شهر کانونی",
    text: "مشهد، اصفهان، شیراز، تبریز و کرج. تقاضای زیبایی این شهرها جدا از صفحهٔ استان نگه داشته شده.",
  },
];

function CoveragePage() {
  return (
    <Shell>
      <PageIntro
        kicker="پوشش جغرافیایی"
        title="همان‌جا که مشتری جستجو می‌کند"
        text="صفحهٔ استان با صفحهٔ شهر یکی نیست. «استان فارس» مخاطب گسترده است و «شیراز» محله‌های داخل شهر را هدف می‌گیرد."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14">
        {groups.map((group) => {
          const list = placesOf(group.kind);
          return (
            <section key={group.kind}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-2xl font-bold">{group.title}</h2>
                <span className="text-sm text-muted">{faNum(list.length)} نقطه</span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-muted">{group.text}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((place) => (
                  <li key={place.slug}>
                    <Link to="/p/$place" params={{ place: place.slug }} className="block h-full rounded-2xl border border-line bg-card p-4">
                      <span className="block font-semibold">{place.name}</span>
                      <span className="mt-1 block text-sm text-muted">{place.areas.join("، ")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Shell>
  );
}
