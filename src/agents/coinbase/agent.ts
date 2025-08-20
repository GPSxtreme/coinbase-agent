import { AgentBuilder } from "@iqai/adk";
import { model } from "../../env";
import { getAgentKitTools } from "./tools";

export const getCoinbaseAgent = async () =>
	AgentBuilder.create("coinbase_agent")
		.withModel(model)
		.withDescription(
			"An agent that specializes in crypto related tasks specially using coinbase api and base network",
		)
		.withTools(...(await getAgentKitTools()))
		.build();
