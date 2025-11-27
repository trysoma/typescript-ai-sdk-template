import type { ProviderController } from "@trysoma/sdk";
import { createSomaFunction } from "@trysoma/sdk";
import z from "zod";
import { assessmentSchema } from "../agents";
export const providerController: ProviderController = {
	typeId: "approve-claim",
	name: "Approve Claim",
	documentation: "Approve a claim",
	categories: [],
	credentialControllers: [
		{
			type: "NoAuth",
		},
	],
};

export default createSomaFunction({
	inputSchema: assessmentSchema,
	outputSchema: z.object({
		approved: z.boolean(),
	}),
	providerController,
	functionController: {
		name: "approve-claim",
		description: "Approve a claim",
	},
	handler: async ({ claim }) => {
		console.log("Claim", claim);
		await new Promise(resolve => setTimeout(resolve, 1000));
		return { approved: Math.random() > 0.5 };
	},
});
