import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { createRedisState } from "@chat-adapter/state-redis";
import { chat } from "@tanstack/ai";
import { vercelGatewayText } from "@tanstack/ai-vercel-gateway";
import { Chat, type Thread } from "chat";
import { toTanStackMessages } from "chat/ai/tanstack";
import { getCurrentTime } from "./tools";

const state = process.env.REDIS_URL
  ? createRedisState({
      url: process.env.REDIS_URL,
      keyPrefix: "chat-sdk-tanstack-start",
    })
  : createMemoryState();

export const bot = new Chat({
  userName: process.env.BOT_USERNAME || "mybot",
  // Reads SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET from the environment
  adapters: { slack: createSlackAdapter() },
  state,
  logger: "info",
});

async function respond(thread: Thread): Promise<void> {
  const history = await thread.adapter.fetchMessages(thread.id, { limit: 20 });

  const stream = chat({
    adapter: vercelGatewayText("anthropic/claude-sonnet-5"),
    systemPrompts: [
      "You are a friendly assistant in a Slack workspace, built with Chat SDK and TanStack AI. Keep replies short.",
    ],
    messages: await toTanStackMessages(history.messages, {
      includeNames: true,
    }),
    tools: [getCurrentTime],
  });

  await thread.post(stream);
}

bot.onNewMention(async (thread) => {
  await thread.subscribe();
  await respond(thread);
});

bot.onSubscribedMessage(async (thread) => {
  await respond(thread);
});

bot.onDirectMessage(async (thread) => {
  await respond(thread);
});
