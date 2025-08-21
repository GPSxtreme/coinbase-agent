import {
	createOpenRouter,
	type LanguageModelV1,
} from "@openrouter/ai-sdk-provider";
import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
	DEBUG: z.string().default("false"),
	OPEN_ROUTER_KEY: z
		.string()
		.optional()
		.describe("When given, agents use open-router endpoint instead"),
	LLM_MODEL: z.string().default("gpt-4.1-mini"),
	CDP_API_KEY_ID: z.string(),
	CDP_API_KEY_SECRET: z.string(),
	WALLET_PRIVATE_KEY: z.string(),
	ZERION_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
export let model: string | LanguageModelV1;

if (env.OPEN_ROUTER_KEY) {
	console.log("🚀 AGENT WILL USE OPENROUTER 🚀");
	const openrouter = createOpenRouter({
		apiKey: env.OPEN_ROUTER_KEY,
	});
	model = openrouter(env.LLM_MODEL);
} else {
	model = env.LLM_MODEL;
}
