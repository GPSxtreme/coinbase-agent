import { createTool } from "@iqai/adk";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { withPaymentInterceptor } from "x402-axios";
import z from "zod";
import { getWalletClient } from "../../coinbase/tools/agentkit";

const API_BASE_URL = "http://localhost:3001";

// Base axios instance without payment interceptor
const baseApiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// This will be dynamically set based on wallet connection
const apiClient: AxiosInstance = withPaymentInterceptor(
	baseApiClient,
	// biome-ignore lint/suspicious/noExplicitAny: <>
	getWalletClient() as any,
);

const getPaymentOptions = createTool({
	name: "GET_PAYMENT_OPTIONS",
	description:
		"Get the list of all available payment options for the api access",
	fn: async () => {
		try {
			const response = await apiClient.get("/api/payment-options");
			return response.data;
		} catch {
			return "something went wrong, try again later";
		}
	},
});

const validateSession = createTool({
	name: "VALIDATE_SESSION",
	description: "Validate the session id",
	schema: z.object({
		sessionId: z.string().describe("the session id that you want to validate"),
	}),
	fn: async ({ sessionId }) => {
		try {
			const response = await apiClient.get(`/api/session/${sessionId}`);
			return response.data;
		} catch {
			return "something went wrong, try again later";
		}
	},
});

const getActiveSessions = createTool({
	name: "GET_ACTIVE_SESSIONS",
	description: "Get the list of all active sessions",
	fn: async () => {
		const response = await apiClient.get("/api/sessions");
		return response.data;
	},
});

const purchase24HourSession = createTool({
	name: "PURCHASE_24_HOUR_SESSION",
	description: "Purchase a 24-hour session access",
	fn: async () => {
		const response = await apiClient.post("/api/pay/session");
		return response.data;
	},
});

const purchaseOneTimeAccess = createTool({
	name: "PURCHASE_ONE_TIME_ACCESS",
	description: "Purchase a one-time access",
	fn: async () => {
		const response = await apiClient.post("/api/pay/onetime");
		return response.data;
	},
});

export const clientTools = [
	getPaymentOptions,
	validateSession,
	getActiveSessions,
	purchase24HourSession,
	purchaseOneTimeAccess,
];
