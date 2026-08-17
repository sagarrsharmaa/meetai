import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { polar, checkout, portal } from "@polar-sh/better-auth";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { isPolarConfigured, polarClient } from "@/lib/polar";

/**
 * The Polar plugin is only registered when an access token exists — otherwise
 * every sign-up would fail on customer creation.
 */
const polarPlugins = isPolarConfigured()
  ? [
      polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
          checkout({
            authenticatedUsersOnly: true,
            successUrl: "/upgrade",
          }),
          portal(),
        ],
      }),
    ]
  : [];

export const auth = betterAuth({
  plugins: polarPlugins,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
});
