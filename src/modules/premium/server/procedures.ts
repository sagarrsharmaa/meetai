import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { isPolarConfigured, polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const premiumRouter = createTRPCRouter({
  getProducts: protectedProcedure.query(async () => {
    if (!isPolarConfigured()) {
      return [];
    }

    const products = await polarClient.products.list({
      isArchived: false,
      isRecurring: true,
      sorting: ["price_amount"],
    });

    return products.result.items;
  }),

  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    if (!isPolarConfigured()) {
      return null;
    }

    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    const subscription = customer.activeSubscriptions[0];

    if (!subscription) {
      return null;
    }

    const product = await polarClient.products.get({
      id: subscription.productId,
    });

    return product;
  }),

  getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    if (isPolarConfigured()) {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });

      const subscription = customer.activeSubscriptions[0];

      // Premium users have no free-tier usage to report.
      if (subscription) {
        return null;
      }
    }

    const [userMeetings] = await db
      .select({ count: count(meetings.id) })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgents] = await db
      .select({ count: count(agents.id) })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    return {
      meetingCount: userMeetings.count,
      agentCount: userAgents.count,
    };
  }),
});
