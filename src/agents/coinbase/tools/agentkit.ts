import {
	AgentKit,
	CdpSmartWalletProvider,
	cdpApiActionProvider,
	erc20ActionProvider,
	pythActionProvider,
	walletActionProvider,
	wethActionProvider,
} from "@coinbase/agentkit";
import type { Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { env } from "../../../env";
/**
 * Get the AgentKit instance.
 *
 * @returns {Promise<AgentKit>} The AgentKit instance
 */
export async function getAgentKit(): Promise<AgentKit> {
	try {
		let privateKey: Hex | null = null;

		if (!privateKey) {
			privateKey = (env.CDP_WALLET_SECRET || generatePrivateKey()) as Hex;
		}

		const owner = privateKeyToAccount(privateKey);

		const walletProvider = await CdpSmartWalletProvider.configureWithWallet({
			apiKeyId: env.CDP_API_KEY_ID,
			apiKeySecret: env.CDP_API_KEY_SECRET,
			walletSecret: env.CDP_WALLET_SECRET,
			networkId: env.NETWORK_ID,
			owner: owner,
		});

		const agentkit = await AgentKit.from({
			walletProvider,
			actionProviders: [
				wethActionProvider(),
				pythActionProvider(),
				walletActionProvider(),
				erc20ActionProvider(),
				cdpApiActionProvider(),
			],
		});

		return agentkit;
	} catch (error) {
		console.error("Error initializing agent:", error);
		throw new Error("Failed to initialize agent");
	}
}
