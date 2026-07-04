function detectLowPower(): boolean {
  if (typeof globalThis.matchMedia !== "function") return false;
  if (!globalThis.matchMedia("(pointer: coarse)").matches) return false;

  const nav = globalThis.navigator as Navigator & { deviceMemory?: number };
  const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const lowCores =
    typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
  return lowMem || lowCores;
}

const LOW_POWER = detectLowPower();
if (LOW_POWER) document.documentElement.classList.add("low-power");

export function useLowPower(): boolean {
  return LOW_POWER;
}
