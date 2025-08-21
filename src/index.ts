import { getCoinbaseAgent } from "./agents/coinbase/agent";

async function main() {
	const { runner } = await getCoinbaseAgent();

	const testPrompts = [
		"Summarize my portfolio in USD and show me the top holdings.",
		"What is the current price of ETH? Convert 100 USD to ETH.",
		"Fetch me the price of XRP & BNB",
	];

	for (const prompt of testPrompts) {
		console.log(`\n=== Prompt ===\n${prompt}\n`);
		const response = await runner.ask(prompt);
		console.log("=== Response ===\n", response);
	}
}

main().catch(console.error);
