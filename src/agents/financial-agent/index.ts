import { AgentBuilder } from "@iqai/adk";
import * as dotenv from "dotenv";
import { CurrencyConverterTool } from "./tools/currency-converter-tool";

dotenv.config();
export const getFinancialAgent = () =>
	AgentBuilder.create("financial_agent")
		.withModel("gemini-2.0-flash")
		.withDescription("Financial assistant for currency conversion")
		.withInstruction("Use the currency_converter tool to convert currencies.")
		.withTools(new CurrencyConverterTool())
		.build();
