import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ItemForm } from "@/web/components/items/item-form";
import { Button } from "@/web/components/ui/button";
import { orpc } from "@/web/lib/orpc";

export const Route = createFileRoute("/items/$itemId")({
	component: ItemEditPage,
});

function ItemEditPage() {
	const { itemId } = Route.useParams();
	const navigate = useNavigate();

	const { data: item, isLoading } = useQuery({
		...orpc.items.getItem.queryOptions({ input: { itemId } }),
	});

	const updateMutation = useMutation({
		...orpc.items.updateItem.mutationOptions(),
	});

	const handleUpdate = (title: string, content: string) => {
		updateMutation.mutate(
			{ itemId, title, content },
			{
				onSuccess: () => {
					toast.success("Item updated successfully");
					navigate({ to: "/items" });
				},
				onError: (error: Error) => {
					toast.error(error.message);
				},
			},
		);
	};

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (!item) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-muted-foreground">Item not found</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate({ to: "/items" })}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<h1 className="font-bold text-3xl">Edit Item</h1>
			</div>

			<ItemForm
				initialTitle={item.title}
				initialContent={item.content}
				onSubmit={handleUpdate}
				onCancel={() => navigate({ to: "/items" })}
				isLoading={updateMutation.isPending}
				submitLabel="Update"
			/>
		</div>
	);
}
