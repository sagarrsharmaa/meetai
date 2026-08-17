import { z } from "zod";

export const meetingsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "Agent is required" }),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
  // Only cancelling is user-driven; every other transition is owned by the
  // Stream webhook so a client can't fake a completed meeting.
  status: z.enum(["cancelled"]).optional(),
});
