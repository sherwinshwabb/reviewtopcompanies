/**
 * List order. One company can be pinned to the top of its category (the paid
 * gold position); everything else is shuffled with a seed that is fixed for a
 * whole build, so every page agrees on who is #2, #3, and so on, and the
 * server and browser render the same order. The seed comes from next.config
 * (RANK_SEED, defaulting to the build date), so each deploy reshuffles.
 */
export const pinnedFirst = ["citadel-gold"];
export const rankSeed = process.env.RANK_SEED || "unseeded";
function hash(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const random = hash(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export function rankProviders<T extends { id: string; category: string }>(
  all: readonly T[],
  categoryIds: readonly string[],
  seed = rankSeed,
): T[] {
  const ranked = categoryIds.flatMap((category) => {
    const inCategory = all.filter((p) => p.category === category);
    const pinned = inCategory.filter((p) => pinnedFirst.includes(p.id));
    const rest = inCategory.filter((p) => !pinnedFirst.includes(p.id));
    return [...pinned, ...seededShuffle(rest, `${seed}:${category}`)];
  });
  return [...ranked, ...all.filter((p) => !ranked.includes(p))];
}
