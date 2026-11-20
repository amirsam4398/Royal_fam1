import { createFileRoute, Link } from "@tanstack/react-router";
import { packages } from "@/data/catalog";
import { PageIntro, Shell } from "@/components/shell";
import { PAY } from "@/lib/pay";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "تعرفه و پلن‌های رویال فام | ۱۰ توکن رایگان و اشتراک ماهانه" },
      {
        name: "description",
        content:
          "شروع رایگان با ۱۰ توکن، سپس پلن‌های ۱ تا ۶ ماهه با قیمت پایین‌تر از عرف بازار. پرداخت کارت‌به‌کارت به نام میثم یعقوبی حسنعلی ده.",
      },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  return (
    <Shell>
      <PageIntro
        kicker="تعرفه"
        title="از رایگان شروع کنید، بعد اشتراک بگیرید"
        text="۱۰ توکن رایگان برای تحلیل و تقویم محتوایی. پلن‌های ماهانه پایین‌تر از عرف آژانس‌ها. پرداخت کارت‌به‌کارت و پیگیری از میز کار."
      />

      <div className="mx-auto max-w-6xl px-4 pb-6">
        <div className="rounded-2xl border border-wine bg-wine p-5 text-paper">
          <p className="text-sm opacity-90">کارت‌به‌کارت</p>
          <p className="mt-2 text-2xl font-bold tracking-wide">{PAY.cardGrouped}</p>
          <p className="mt-1">به‌نام {PAY.holder}</p>
          <p className="mt-3 text-sm opacity-85">بعد از واریز، تصویر رسید را در واتساپ یا بله بفرستید تا پلن فعال شود.</p>
        </div>
      </div>

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
              {item.id === "free" ? "شروع رایگان" : "درخواست این پلن"}
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
