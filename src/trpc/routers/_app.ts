import { createTRPCRouter } from "../init";

import { agentsRouter } from "@/backend/modules/agents/server/procedures";
import { meetingsRouter } from "@/backend/modules/meetings/server/procedures";
import { premiumRouter } from "@/backend/modules/premium/server/procedures";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  premium: premiumRouter,
});

export type AppRouter = typeof appRouter;
