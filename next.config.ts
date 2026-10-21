import type { NextConfig } from "next";
import { aliases } from "./lib/routes";
const nextConfig: NextConfig = {
  redirects() {
    return Object.entries(aliases).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};
export default nextConfig;
