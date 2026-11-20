const KEY = "royalfam.tokens.v1";
const FREE_GRANT = 10;

export type TokenState = {
  remaining: number;
  used: number;
  grantedAt: number;
};

function empty(): TokenState {
  return { remaining: FREE_GRANT, used: 0, grantedAt: Date.now() };
}

export function readTokens(): TokenState {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as TokenState;
    if (typeof parsed.remaining !== "number" || typeof parsed.used !== "number") return empty();
    return {
      remaining: Math.max(0, Math.floor(parsed.remaining)),
      used: Math.max(0, Math.floor(parsed.used)),
      grantedAt: typeof parsed.grantedAt === "number" ? parsed.grantedAt : Date.now(),
    };
  } catch {
    return empty();
  }
}

export function writeTokens(state: TokenState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function consumeToken(): boolean {
  const current = readTokens();
  if (current.remaining <= 0) return false;
  writeTokens({
    remaining: current.remaining - 1,
    used: current.used + 1,
    grantedAt: current.grantedAt,
  });
  return true;
}

export function remainingTokens(): number {
  return readTokens().remaining;
}

export function resetTokensForDemo() {
  writeTokens(empty());
}
