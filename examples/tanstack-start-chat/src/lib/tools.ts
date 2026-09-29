import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

export const getCurrentTime = toolDefinition({
  name: "getCurrentTime",
  description:
    "Get the current date and time in a given IANA time zone, such as Europe/London or Australia/Sydney.",
  inputSchema: z.object({
    timeZone: z
      .string()
      .describe("IANA time zone name, for example America/New_York"),
  }),
}).server(({ timeZone }) => {
  try {
    const formatted = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone,
    }).format(new Date());
    return { timeZone, formatted };
  } catch {
    return { timeZone, error: `Unknown time zone: ${timeZone}` };
  }
});
