import { getCoinbaseAgent } from "./agents/coinbase/agent";

async function main() {
	const { runner } = await getCoinbaseAgent();
	const response = await runner.ask("Convert 100 USD to EUR.");
	console.log(response);
}

main().catch(console.error);
