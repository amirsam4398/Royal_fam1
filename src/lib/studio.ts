export function studioPack(input: { name: string; place: string; service: string; handle: string }) {
  const name = input.name.trim() || "کسب‌وکار";
  const place = input.place.trim() || "تهران";
  const service = input.service.trim() || "خدمات زیبایی";
  const handle = input.handle.trim().replace(/^@/, "");
  const title = `${service} در ${place} | ${name}`.slice(0, 60);
  const description =
    `${name} در ${place}: نوبت ${service}، معرفی کار و راه تماس. این متن برای متای صفحه و توضیح پیج اینستاگرام نوشته شده، نه برای پر کردن صفحه از واژه.`.slice(
      0,
      160,
    );
  const keywords = [
    `${service} ${place}`,
    `نوبت ${service}`,
    `${name} ${place}`,
    `نزدیک ${place}`,
    handle ? `اینستاگرام ${handle}` : `پیج ${service}`,
    "رویال فام",
  ];
  const bio = [`${name} · ${place}`, service, "نوبت از دایرکت", handle ? `@${handle}` : ""]
    .filter(Boolean)
    .join("\n");
  const tags = Array.from(
    new Set(
      [
        "رویال_فام",
        "سالن_زیبایی",
        "کلینیک_زیبایی",
        place.replace(/\s+/g, "_"),
        service.replace(/\s+/g, "_"),
        "نوبت",
        "نمونه_کار",
        handle,
      ].filter(Boolean),
    ),
  ).map((tag) => `#${tag}`);
  const caption = [
    `${service} در ${place}`,
    `${name} نوبت این هفته را باز گذاشته.`,
    "برای وقت، دایرکت بدهید یا شماره را در پیام بگذارید.",
    tags.slice(0, 6).join(" "),
  ].join("\n");
  const week = [
    "شنبه: یک نمونه کار، بدون فیلتر سنگین",
    "دوشنبه: جواب یک سؤال مشتری دربارهٔ همان خدمت",
    "چهارشنبه: داستان کوتاه یک نوبت، با نام محله",
    "جمعه: فراخوان نوبت هفتهٔ بعد، با یک جمله",
  ];
  return { title, description, keywords, bio, tags, caption, week };
}
