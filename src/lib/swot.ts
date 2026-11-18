export type RivalLevel = "local" | "province" | "country";

export type RivalInput = {
  name: string;
  level: RivalLevel;
  followers: number;
  site: string;
};

export type SwotInput = {
  followers: number;
  likes: number;
  postsPerWeek: number;
  visits: number;
  rivals: RivalInput[];
};

export const LEVEL_LABEL: Record<RivalLevel, string> = {
  local: "محلی",
  province: "استانی",
  country: "کشوری",
};

export function engagementRate(followers: number, likes: number) {
  if (followers <= 0) return 0;
  return (likes / followers) * 100;
}

export function analyzeSwot(input: SwotInput) {
  const rate = engagementRate(input.followers, input.likes);
  const known = input.rivals.filter((rival) => rival.name.trim() && rival.followers > 0);
  const ahead = known.filter((rival) => rival.followers > input.followers);
  const localAhead = ahead.filter((rival) => rival.level === "local").length;
  const nationalAhead = ahead.filter((rival) => rival.level === "country").length;
  const strength = clamp(rate * 20 + Math.min(input.postsPerWeek, 7) * 6);
  const weakness = clamp((rate < 1 ? 40 : 10) + (input.postsPerWeek < 3 ? 35 : 8) + (input.visits < 100 ? 20 : 0));
  const opportunity = clamp(30 + (known.length - ahead.length) * 8 + (input.visits > 0 ? 10 : 0));
  const threat = clamp(localAhead * 12 + nationalAhead * 18 + (known.some((rival) => rival.followers > input.followers * 5) ? 20 : 0));
  return {
    rate,
    known,
    scores: [
      { key: "S", label: "قوت", value: strength, note: rate >= 3 ? "نرخ تعامل بالاست." : "نرخ تعامل هنوز به ۳ درصد نرسیده." },
      { key: "W", label: "ضعف", value: weakness, note: input.postsPerWeek < 3 ? "هفته‌ای کمتر از ۳ پست." : "ریتم انتشار قابل قبول است." },
      { key: "O", label: "فرصت", value: opportunity, note: "فاصله با رقیب‌هایی که عددشان کمتر است." },
      { key: "T", label: "تهدید", value: threat, note: nationalAhead > 0 ? "رقیب کشوری جلوتر است." : "تهدید کشوری در این اعداد دیده نشد." },
    ],
  };
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
