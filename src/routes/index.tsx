import { createFileRoute, Link } from "@tanstack/react-router";
import { landingCount, placesOf, servicesOf, tierLabel } from "@/data/catalog";
import { Shell } from "@/components/shell";
import { bankSize, faNum } from "@/lib/seo";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const districts = placesOf("district");
  const salons = servicesOf(1);
  const desks = districts.slice(0, 6).map((place, index) => ({
    place,
    service: salons[index % salons.length],
  }));

  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7">
          <p className="text-sm font-semibold text-wine">تهران، شهرستان‌ها، ۳۱ استان</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-balance sm:text-5xl">
            مشتری را به سالن برسانید، نه فقط بازدیدکننده.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            رویال فام برای هر منطقه و هر خدمت یک صفحهٔ ثابت می‌سازد. اولویت با سالن زیبایی است، بعد کلینیک، بعد بقیهٔ خدماتی که مردم محلی می‌گردند.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/request" className="inline-flex min-h-11 items-center rounded-full bg-wine px-5 font-medium text-paper">
              درخواست جذب مشتری
            </Link>
            <Link to="/directory" className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-5 font-medium">
              دیدن صفحات محلی
            </Link>
            <a href="/royal-fam-source.zip" download className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-5 font-medium">
              دانلود کد
            </a>
          </div>
        </div>
        <ol className="grid gap-3 lg:col-span-5">
          {(
            [
              { tier: "1", title: "سالن زیبایی", text: "نوبت رنگ، ناخن، مژه و عروس. اولین صف جذب." },
              { tier: "2", title: "کلینیک زیبایی", text: "لیزر، پوست، ژل و کاشت. مشتری مقایسه می‌کند." },
              { tier: "3", title: "بقیهٔ خدمات", text: "املاک، خودرو، تعمیر، استخدام و باقی دسته‌ها." },
            ] as const
          ).map((lane) => (
            <li key={lane.tier} className="rounded-2xl border border-line border-t-2 border-t-gold bg-card p-5">
              <p className="text-sm text-muted">اولویت {faNum(Number(lane.tier))}</p>
              <h2 className="mt-1 text-xl font-semibold">{lane.title}</h2>
              <p className="mt-1 text-sm text-muted">{lane.text}</p>
              <Link to="/services" search={{ tier: lane.tier }} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-wine">
                خدمات {tierLabel[Number(lane.tier) as 1 | 2 | 3]}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {(
            [
              [faNum(bankSize()), "عبارت جستجوی ترکیبی"],
              [faNum(landingCount), "صفحهٔ محلی آماده"],
              [faNum(22), "منطقه در تهران"],
              ["۱۰۰ ثانیه", "تازه‌شدن لایهٔ سئو"],
            ] as const
          ).map(([value, label]) => (
            <div key={label} className="border-line px-4 py-6 odd:border-e lg:border-e lg:last:border-e-0">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="mt-1 text-2xl font-bold text-wine sm:text-3xl">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">۲۲ منطقه، هر کدام یک ورودی</h2>
            <p className="mt-1 text-sm text-muted">از تجریش تا دریاچه. صفحهٔ منطقه، خدمت‌های همان‌جا را فهرست می‌کند.</p>
          </div>
          <Link to="/coverage" className="hidden min-h-11 items-center text-sm font-medium text-wine sm:inline-flex">
            شهرستان و استان
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
          {districts.map((place) => (
            <li key={place.slug} className="bg-card">
              <Link to="/p/$place" params={{ place: place.slug }} className="block min-h-24 p-4 hover:bg-paper">
                <span className="block text-sm text-muted">{place.areas[0]}</span>
                <span className="mt-1 block font-semibold">{place.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">جایگاه آماده، نه آگهی ساختگی</h2>
          <p className="mt-2 text-muted">
            این‌ها ویترین خالی‌اند تا کسب‌وکار واقعی روش بنشیند. اسم مشتری و عدد فروش جعلی نداریم.
          </p>
          <ul className="mt-5 grid gap-3">
            {desks.map(({ place, service }) => (
              <li key={place.slug}>
                <Link
                  to="/p/$place/$service"
                  params={{ place: place.slug, service: service.slug }}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3"
                >
                  <span>
                    <span className="block font-medium">{service.name}</span>
                    <span className="block text-sm text-muted">{place.name}</span>
                  </span>
                  <span className="text-sm text-wine">صفحه</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-2xl font-bold">سه حرکت تا مشتری</h2>
          <ol className="mt-5 grid gap-5">
            {[
              ["صفحهٔ محلی", "منطقه و خدمت به هم قفل می‌شوند. عنوان صفحه ثابت است تا موتور جستجو آن را گم نکند."],
              ["لایهٔ زنده", "هر ۱۰۰ ثانیه کلیدواژه و توضیح تکمیلی همان صفحه عوض می‌شود. فونت هم روی خود سایت است، مناسب وقتی اینترنت بین‌الملل کند است."],
              ["درخواست", "صاحب سالن یا خود مشتری درخواست را ثبت می‌کند. تا این نسخه، درخواست فقط روی دستگاه خودش ذخیره می‌شود."],
            ].map(([title, text], index) => (
              <li key={title} className="grid grid-cols-[auto_1fr] gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-wine text-paper">{faNum(index + 1)}</span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-1 block text-sm text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-wine text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">نوبت خالی، هدف صفحه است</h2>
            <p className="mt-2 max-w-xl text-paper/80">اگر سالن یا کلینیک دارید، منطقه را انتخاب کنید. اگر مشتری‌اید، همان فرم را با نقش مشتری پر کنید.</p>
          </div>
          <Link to="/request" className="inline-flex min-h-11 items-center justify-center rounded-full bg-paper px-5 font-medium text-wine">
            شروع درخواست
          </Link>
        </div>
      </section>
    </Shell>
  );
}
