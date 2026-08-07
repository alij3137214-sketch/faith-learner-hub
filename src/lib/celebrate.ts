import confetti from "canvas-confetti";

const EMERALD = "#0f7a5a";
const GOLD = "#c9a227";
const IVORY = "#f6f3ea";

export function celebrate(intensity: "small" | "large" = "small") {
  if (typeof window === "undefined") return;
  const colors = [EMERALD, GOLD, IVORY];
  if (intensity === "small") {
    void confetti({ particleCount: 55, spread: 62, origin: { y: 0.7 }, colors, scalar: 0.85, disableForReducedMotion: true });
    return;
  }
  const end = Date.now() + 900;
  void confetti({ particleCount: 120, spread: 90, origin: { y: 0.65 }, colors, disableForReducedMotion: true });
  const frame = () => {
    void confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, disableForReducedMotion: true });
    void confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
