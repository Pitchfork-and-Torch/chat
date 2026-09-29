import { createFileRoute } from "@tanstack/react-router";
import { waitUntil } from "@vercel/functions";
import { bot } from "../../../lib/bot";

type Platform = keyof typeof bot.webhooks;

function getHandler(platform: string) {
  return bot.webhooks[platform as Platform];
}

export const Route = createFileRoute("/api/webhooks/$platform")({
  server: {
    handlers: {
      GET: ({ params }) => {
        if (!getHandler(params.platform)) {
          return new Response(`Unknown platform: ${params.platform}`, {
            status: 404,
          });
        }
        return new Response(`${params.platform} webhook endpoint is active`);
      },
      POST: ({ request, params }) => {
        const handler = getHandler(params.platform);
        if (!handler) {
          return new Response(`Unknown platform: ${params.platform}`, {
            status: 404,
          });
        }
        // waitUntil keeps the function alive after the platform gets its
        // fast acknowledgement, so the handler can finish streaming a reply
        return handler(request, { waitUntil });
      },
    },
  },
});
