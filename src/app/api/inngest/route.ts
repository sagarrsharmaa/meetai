import { serve } from "inngest/next";

import { inngest } from "@/backend/inngest/client";
import { meetingsProcessing } from "@/backend/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [meetingsProcessing],
});
