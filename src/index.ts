import { getFinancialAgent } from "./agents/financial-agent";

async function main() {
	const { runner } = await getFinancialAgent();
	const response = await runner.ask("Convert 100 USD to EUR.");
	console.log(response);
}

main().catch(console.error);
