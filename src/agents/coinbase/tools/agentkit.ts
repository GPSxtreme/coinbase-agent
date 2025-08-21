import {
	AgentKit,
	defillamaActionProvider,
	erc20ActionProvider,
	pythActionProvider,
	ViemWalletProvider,
	walletActionProvider,
	x402ActionProvider,
	zerionActionProvider,
} from "@coinbase/agentkit";
import { getMcpTools } from "@coinbase/agentkit-model-context-protocol";
import { type BaseTool, convertMcpToolToBaseTool } from "@iqai/adk";
import { type Address, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { env } from "../../../env";

/**
 * Retrieves and converts MCP tools from AgentKit to BaseTool format.
 *
 * @returns An array of BaseTool objects.
 */
export async function getAgentKitTools(): Promise<BaseTool[]> {
	const agentKit = await getAgentKit();
	const { tools, toolHandler } = await getMcpTools(agentKit);
	const baseTools = await Promise.all(
		tools.map(async (mcpTool) =>
			convertMcpToolToBaseTool({ mcpTool, toolHandler }),
		),
	);
	return baseTools;
}

/**
 * Get the AgentKit instance.
 *
 * @returns The AgentKit instance
 */
export async function getAgentKit(): Promise<AgentKit> {
	try {
		const account = privateKeyToAccount(env.WALLET_PRIVATE_KEY as Address);

		const client = createWalletClient({
			account,
			chain: base, // x402 provider seems to only work on base evm. replace this with any other chain
			transport: http(),
		});

		const walletProvider = new ViemWalletProvider(client);

		const agentkit = await AgentKit.from({
			walletProvider,
			actionProviders: [
				// fetching prices of tokens
				pythActionProvider(),
				// to get wallet details, make native blockchain transfers
				walletActionProvider(),
				// makes http requests
				x402ActionProvider(),
				// balance & transfer ops on erc-20 tokens
				erc20ActionProvider(),
				// Portfolio summarizer
				zerionActionProvider(),
				// querying defi llama platform for coin data & stuff
				defillamaActionProvider(),
			],
		});

		return agentkit;
	} catch (error) {
		console.error("Error initializing agent:", error);
		throw new Error("Failed to initialize agent");
	}
}
