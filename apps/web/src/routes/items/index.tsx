import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Item } from "@/server/domain/items";
import { ItemCard } from "@/web/components/items/item-card";
import { ItemForm } from "@/web/components/items/item-form";
import { Button } from "@/web/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/web/components/ui/dialog";
import { orpc } from "@/web/lib/orpc";

export const Route = createFileRoute("/items/")({
	component: ItemsPage,
});

function ItemsPage() {
	const navigate = useNavigate();
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const { data, isLoading, refetch } = useQuery({
		...orpc.items.listItems.queryOptions({ input: {} }),
	});

	const createMutation = useMutation({
		...orpc.items.createItem.mutationOptions(),
	});

	const deleteMutation = useMutation({
		...orpc.items.deleteItem.mutationOptions(),
	});

	const handleCreate = (title: string, content: string) => {
		createMutation.mutate(
			{ title, content },
			{
				onSuccess: () => {
					toast.success("Item created successfully");
					setIsCreateOpen(false);
					refetch();
				},
				onError: (error: Error) => {
					toast.error(error.message);
				},
			},
		);
	};

	const handleDelete = (itemId: string) => {
		if (confirm("Are you sure you want to delete this item?")) {
			deleteMutation.mutate(
				{ itemId },
				{
					onSuccess: () => {
						toast.success("Item deleted successfully");
						refetch();
					},
					onError: (error: Error) => {
						toast.error(error.message);
					},
				},
			);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-3xl">Items</h1>
				<Button onClick={() => setIsCreateOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					New Item
				</Button>
			</div>

			{data?.items && data.items.length > 0 ? (
				<div className="grid gap-4">
					{data.items.map((item: Item) => (
						<ItemCard
							key={item.id}
							item={item}
							onDelete={handleDelete}
							onClick={() => navigate({ to: `/items/${item.id}` })}
						/>
					))}
				</div>
			) : (
				<div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
					<div className="text-center">
						<p className="mb-4 text-muted-foreground">No items yet</p>
						<Button onClick={() => setIsCreateOpen(true)}>
							<Plus className="mr-2 h-4 w-4" />
							Create your first item
						</Button>
					</div>
				</div>
			)}

			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Item</DialogTitle>
					</DialogHeader>
					<ItemForm
						onSubmit={handleCreate}
						onCancel={() => setIsCreateOpen(false)}
						isLoading={createMutation.isPending}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
