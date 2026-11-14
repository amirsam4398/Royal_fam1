import { create } from "zustand";

export type PulseLog = {
  slot: number;
  at: number;
  line: string;
};

type PulseState = {
  slot: number;
  left: number;
  ready: boolean;
  log: PulseLog[];
  apply: (slot: number, left: number, line: string) => void;
};

export const usePulse = create<PulseState>((set, get) => ({
  slot: 0,
  left: 100,
  ready: false,
  log: [],
  apply: (slot, left, line) => {
    const prev = get();
    if (prev.ready && prev.slot === slot && prev.left === left) return;
    if (!prev.ready || prev.slot !== slot) {
      set({
        slot,
        left,
        ready: true,
        log: [{ slot, at: Date.now(), line }, ...prev.log].slice(0, 8),
      });
      return;
    }
    set({ left });
  },
}));

export function writeMeta(name: string, content: string) {
  if (typeof document === "undefined") return;
  let node = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("name", name);
    document.head.appendChild(node);
  }
  if (node.getAttribute("content") !== content) node.setAttribute("content", content);
}
