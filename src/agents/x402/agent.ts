import { AgentBuilder } from "@iqai/adk";
import dedent from "dedent";
import { model } from "../../env";
import { clientTools } from "./tools/client";

export const getX402Agent = async () =>
	AgentBuilder.create("x402_agent")
		.withModel(model)
		.withDescription(
			"An agent that specializes in testing the payment using the x402 protocol",
		)
		.withInstruction(
			dedent`
				You are a testing agent that has access to several tools that can communicate with the local testing api.
        this api provides a list of endpoints for testing payment using the x402 protocol.
        use the tools given to you to aid the user in testing the payment using the x402 protocol.
			`,
		)
		.withTools(...clientTools)
		.build();
