import { Polar } from "@polar-sh/sdk";

export const isPolarConfigured = () => !!process.env.POLAR_ACCESS_TOKEN;

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  // Point at Polar's sandbox while developing; switch to "production" when live.
  server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
});
