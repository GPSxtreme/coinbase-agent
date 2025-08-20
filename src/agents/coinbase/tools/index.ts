import { getMcpTools } from "@coinbase/agentkit-model-context-protocol";
import { type BaseTool, convertMcpToolToBaseTool } from "@iqai/adk";
import { getAgentKit } from "./agentkit";

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
