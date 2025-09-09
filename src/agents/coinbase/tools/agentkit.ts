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
import {
	type Address,
	createWalletClient,
	http,
	type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
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

export function getWalletClient(): WalletClient {
	const account = privateKeyToAccount(env.WALLET_PRIVATE_KEY as Address);

	return createWalletClient({
		account,
		chain: baseSepolia,
		transport: http(),
	});
}

/**
 * Get the AgentKit instance.
 *
 * @returns The AgentKit instance
 */
export async function getAgentKit(): Promise<AgentKit> {
	try {
		const walletProvider = new ViemWalletProvider(getWalletClient());

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
