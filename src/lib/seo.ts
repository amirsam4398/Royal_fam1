import { places, services, type Place, type Service } from "@/data/catalog";

export const INTENTS = [
  "بهترین",
  "قیمت",
  "نوبت",
  "نزدیک من",
  "تخفیف",
  "آدرس",
  "نمونه کار",
  "رزرو",
  "تلفن",
  "شبانه‌روزی",
  "ویژه",
  "عروس",
  "اینستاگرام",
  "تبلیغات محلی",
  "سئو گوگل",
  "جذب مشتری",
  "ارزان",
  "لوکس",
  "فوری",
  "مخصوص خانم‌ها",
  "مخصوص آقایان",
  "مرکز",
  "آموزش",
  "کمپین",
  "پیج اینستاگرام",
  "محتوا",
  "مشاوره",
  "نوبت آنلاین",
] as const;

export const SUFFIXES = [
  "با نوبت آنلاین",
  "ویژه همین منطقه",
  "برای کسب‌وکار محلی",
  "با نمونه کار",
  "مناسب مجلس",
  "با تبلیغ هدفمند",
  "قابل رزرو",
  "نزدیک محل شما",
  "با مدیریت پیج",
  "برای دیده شدن",
  "با معرفی مشتری",
  "بدون واسطهٔ اضافه",
  "روی نت داخلی",
  "با نام محله",
  "برای پر شدن نوبت",
  "با معرفی کلینیک",
] as const;

const digits = "۰۱۲۳۴۵۶۷۸۹";

export function faNum(value: number) {
  const rounded = Math.round(value).toString();
  const grouped = rounded.replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  return grouped.replace(/\d/g, (digit) => digits[Number(digit)] ?? digit);
}

export function faRaw(value: string | number) {
  return String(value).replace(/\d/g, (digit) => digits[Number(digit)] ?? digit);
}

export function bankParts() {
  const placeCount = places.length;
  const serviceCount = services.length;
  const areaCount = places.reduce((sum, place) => sum + place.areas.length, 0);
  const intent = serviceCount * placeCount * INTENTS.length;
  const suffix = serviceCount * placeCount * SUFFIXES.length;
  const area = serviceCount * areaCount;
  return {
    places: placeCount,
    services: serviceCount,
    areas: areaCount,
    intent,
    suffix,
    area,
    total: intent + suffix + area,
  };
}

export function bankSize() {
  return bankParts().total;
}

export function stablePhrases(service: Service, place: Place) {
  return [
    `${service.name} در ${place.name}`,
    ...place.areas.map((area) => `${service.name} ${area}`),
    `تبلیغات ${service.name} ${place.name}`,
    `سئو ${service.family} ${place.name}`,
    `اینستاگرام ${service.name} ${place.name}`,
  ];
}

export function wavePhrases(service: Service, place: Place, slot: number) {
  const phrases: string[] = [];
  for (let index = 0; index < 4; index += 1) {
    const intent = INTENTS[(slot + index) % INTENTS.length];
    phrases.push(`${intent} ${service.name} در ${place.name}`);
  }
  const area = place.areas[slot % place.areas.length] ?? place.areas[0];
  phrases.push(`${service.name} ${area}`);
  const suffix = SUFFIXES[slot % SUFFIXES.length];
  phrases.push(`${service.name} در ${place.name} ${suffix}`);
  return phrases;
}

export function pageSeo(service: Service, place: Place) {
  const title = `${service.name} در ${place.name} | رویال فام`;
  const description = `جذب مشتری برای ${service.name} در ${place.name}، از جمله ${place.areas[0]} و ${place.areas[1]}. تبلیغ محلی، اینستاگرام و سئو؛ اولویت با سالن و کلینیک زیبایی.`;
  return {
    title,
    description,
    keywords: stablePhrases(service, place).join("، "),
  };
}

export function landingCopy(service: Service, place: Place) {
  const areas = place.areas.join("، ");
  const priority =
    service.tier === 1
      ? "این صفحه در اولویت اول شبکه است: سالن زیبایی، جایی که نوبت خالی مستقیم به درآمد تبدیل می‌شود."
      : service.tier === 2
        ? "بعد از سالن، نوبت کلینیک زیبایی است. جستجو طولانی‌تر است و مشتری قبل از تماس مقایسه می‌کند."
        : "این دسته بعد از زیبایی پوشش داده می‌شود؛ همان منطق محلی، برای خدماتی که مردم در شهر خودشان می‌گردند.";
  return [
    `${service.name} در ${place.name} یک ویترین ثابت است، نه یک آگهی که فردا پاک شود. مشتری که «${service.name}» را با نام این منطقه جستجو می‌کند باید به یک صفحهٔ مشخص برسد.`,
    `نقطه‌های زیر پوشش همین صفحه: ${areas}. ${place.line}. نام محله داخل متن نشسته تا جستجوی محلی به همین کسب‌وکار وصل شود.`,
    `${service.line} ${priority}`,
  ];
}

export function scopeForPath(pathname: string, slot: number) {
  const landing = pathname.match(/^\/p\/([^/]+)(?:\/([^/]+))?\/?$/);
  if (landing) {
    const place = places.find((item) => item.slug === landing[1]);
    const service = landing[2]
      ? services.find((item) => item.slug === landing[2])
      : services[slot % services.length];
    if (place && service) return { place, service };
  }
  const servicePath = pathname.match(/^\/s\/([^/]+)\/?$/);
  if (servicePath) {
    const service = services.find((item) => item.slug === servicePath[1]);
    if (service) return { place: places[slot % places.length] ?? places[0], service };
  }
  const priority = services.filter((item) => item.tier <= 2);
  return {
    place: places[slot % places.length] ?? places[0],
    service: priority[slot % priority.length] ?? services[0],
  };
}
