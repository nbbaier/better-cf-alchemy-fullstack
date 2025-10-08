import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { publicProcedure } from "@/server/lib/orpc";
import { itemsRouter } from "./items-router";
import { profileRouter } from "./profile-router";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	helloFrom: publicProcedure.handler(() => {
		return "CF+Hono+oRPC";
	}),
	items: itemsRouter,
	profile: profileRouter,
} as const;

export type AppRouter = typeof appRouter;
export type RouterOutputs = InferRouterOutputs<AppRouter>;
export type RouterInputs = InferRouterInputs<AppRouter>;
