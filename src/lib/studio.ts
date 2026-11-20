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
  const bio = [`${name} · \( {place}`, service, "نوبت از دایرکت", handle ? `@ \){handle}` : ""]
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

  const calendar2Days = [
    {
      day: "روز ۱",
      title: "نمونه کار واقعی + محله",
      body: `یک عکس یا ویدیوی کوتاه از ${service} با نام محله یا منطقه \( {place}. متن: « \){service} در ${place} — نوبت این هفته باز است.» بدون فیلتر سنگین و بدون وعده معجزه.`,
    },
    {
      day: "روز ۲",
      title: "سؤال مشتری + فراخوان نوبت",
      body: `یک سؤال پرتکرار مشتری درباره ${service} را جواب بده (مثلاً مدت جلسه یا مراقبت بعد از کار). آخر پست: «برای رزرو در ${place} دایرکت بدهید.»`,
    },
  ];

  const week = [
    "شنبه: یک نمونه کار، بدون فیلتر سنگین + نام محله",
    "دوشنبه: جواب یک سؤال مشتری دربارهٔ همان خدمت",
    "سه‌شنبه: پشت‌صحنه کوتاه یا ابزار کار",
    "چهارشنبه: داستان کوتاه یک نوبت موفق، با نام منطقه",
    "پنج‌شنبه: مقایسه قبل/بعد (اگر مجاز و واقعی باشد)",
    "جمعه: فراخوان نوبت هفتهٔ بعد، با یک جمله روشن",
  ];

  const aiSeoNotes = [
    "عنوان و H1 باید شامل خدمت + مکان باشد (گوگل کلاسیک).",
    "پاراگراف اول جواب مستقیم سؤال کاربر را بدهد (مناسب ChatGPT / Gemini / Claude / Grok).",
    "موجودیت‌های واضح بنویسید: نام کسب‌وکار، خدمت، محله، شهر (برای درک بهتر LLMها).",
    "از لیست و سؤال‌جواب کوتاه استفاده کنید تا موتورهای هوش مصنوعی راحت‌تر نقل کنند.",
    "متن حدود ۸۰۰–۱۲۰۰ کلمه برای صفحه خدمت محلی هدف خوبی است؛ پر کردن مصنوعی نکنید.",
    "schema.org و متای کامل را نگه دارید تا هم گوگل و هم سیستم‌های مبتنی بر LLM سیگنال بگیرند.",
  ];

  const longDraftOutline = [
    `مقدمه: ${service} در ${place} چیست و چرا مشتری محلی جستجو می‌کند.`,
    `خدمات دقیق ${name} و تفاوت با رقبای همان منطقه.`,
    `محله‌ها و مناطق پوشش‌داده‌شده (نام واقعی بنویسید).`,
    `فرآیند نوبت‌گیری، زمان تقریبی و مراقبت‌های بعد از کار.`,
    `نمونه کار و سؤالات پرتکرار مشتریان ${place}.`,
    `فراخوان واضح: تماس، دایرکت یا فرم درخواست.`,
  ];

  return {
    title,
    description,
    keywords,
    bio,
    tags,
    caption,
    week,
    calendar2Days,
    aiSeoNotes,
    longDraftOutline,
  };
}
