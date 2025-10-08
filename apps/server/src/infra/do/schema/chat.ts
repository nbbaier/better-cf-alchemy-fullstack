import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	created: integer("created", { mode: "timestamp_ms" })
		.$defaultFn(() => new Date())
		.notNull(),
	updated: integer("updated", { mode: "timestamp_ms" })
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
});
