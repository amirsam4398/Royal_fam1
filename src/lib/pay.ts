export const PAY = {
  card: "6104338941802312",
  cardGrouped: "6104 3389 4180 2312",
  holder: "میثم یعقوبی حسنعلی ده",
  brand: "استارتاپ فناورانه هوش مصنوعی رویال فام",
  claim: "اولین استارتاپ وایپ‌کدینگ هوش مصنوعی در ایران",
  legal:
    "هرگونه کپی‌برداری از مطالب سایت و اثر فکری و معنوی صاحب سایت پیگرد قانونی و قضایی دارد.",
};

const LINE_KEY = "royalfam.owner-line";

export function readOwnerLine() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(LINE_KEY) ?? "";
}

export function saveOwnerLine(value: string) {
  localStorage.setItem(LINE_KEY, value.replace(/\D/g, ""));
}

export function paymentText(input: { name: string; subject: string; amount: string }) {
  return [
    "رویال فام",
    PAY.brand,
    PAY.claim,
    "پرداخت کارت‌به‌کارت",
    input.name ? `برای: ${input.name}` : "",
    `بابت: ${input.subject}`,
    input.amount ? `مبلغ: ${input.amount}` : "",
    `به‌نام: ${PAY.holder}`,
    `شماره کارت: ${PAY.cardGrouped}`,
    "بعد از واریز، تصویر رسید را در همین گفتگو بفرستید.",
  ]
    .filter(Boolean)
    .join("\n");
}

function intl(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("98")) return digits;
  if (digits.startsWith("0")) return `98${digits.slice(1)}`;
  return digits;
}

export function waLink(phone: string, text: string) {
  const number = intl(phone);
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function baleLink(text: string) {
  return `https://ble.ir/share?text=${encodeURIComponent(text)}`;
}
