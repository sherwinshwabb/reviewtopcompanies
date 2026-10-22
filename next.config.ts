import type { NextConfig } from "next";
import { aliases } from "./lib/routes";
const nextConfig: NextConfig = {
  // Fixed for the whole build so every page agrees on the shuffled order.
  env: {
    RANK_SEED: process.env.RANK_SEED ?? new Date().toISOString().slice(0, 10),
  },
  redirects() {
    return Object.entries(aliases).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};
export default nextConfig;
