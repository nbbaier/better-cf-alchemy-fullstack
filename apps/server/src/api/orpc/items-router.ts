import { z } from "zod";
import { getUserDOStub } from "@/server/infra/do/user-do-helper";
import { protectedProcedure } from "@/server/lib/orpc";
import { ItemRepository } from "@/server/repositories/do/item-repository";
import { ItemService } from "@/server/services/items/item-service";

const listItemsSchema = z.object({
	limit: z.number().int().positive().max(200).optional(),
	cursor: z.number().int().optional(),
});

const createItemSchema = z.object({
	title: z.string().min(1).max(200),
	content: z.string().max(10000),
});

const updateItemSchema = z.object({
	itemId: z.string().min(1),
	title: z.string().min(1).max(200),
	content: z.string().max(10000),
});

export const itemsRouter = {
	listItems: protectedProcedure
		.input(listItemsSchema)
		.handler(async ({ context, input }) => {
			const stub = getUserDOStub(context.env, context.session.user.id);
			const repo = new ItemRepository(stub);
			const service = new ItemService(repo);
			return await service.listItems(input.limit, input.cursor);
		}),

	getItem: protectedProcedure
		.input(z.object({ itemId: z.string().min(1) }))
		.handler(async ({ context, input }) => {
			const stub = getUserDOStub(context.env, context.session.user.id);
			const repo = new ItemRepository(stub);
			const service = new ItemService(repo);
			const item = await service.getItem(input.itemId);
			if (!item) {
				throw new Error("Item not found");
			}
			return item;
		}),

	createItem: protectedProcedure
		.input(createItemSchema)
		.handler(async ({ context, input }) => {
			const stub = getUserDOStub(context.env, context.session.user.id);
			const repo = new ItemRepository(stub);
			const service = new ItemService(repo);
			return await service.createItem(input.title, input.content);
		}),

	updateItem: protectedProcedure
		.input(updateItemSchema)
		.handler(async ({ context, input }) => {
			const stub = getUserDOStub(context.env, context.session.user.id);
			const repo = new ItemRepository(stub);
			const service = new ItemService(repo);
			return await service.updateItem(input.itemId, input.title, input.content);
		}),

	deleteItem: protectedProcedure
		.input(z.object({ itemId: z.string().min(1) }))
		.handler(async ({ context, input }) => {
			const stub = getUserDOStub(context.env, context.session.user.id);
			const repo = new ItemRepository(stub);
			const service = new ItemService(repo);
			return await service.deleteItem(input.itemId);
		}),
} as const;
