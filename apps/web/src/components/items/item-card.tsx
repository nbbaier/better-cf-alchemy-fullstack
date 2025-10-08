import { Trash2 } from "lucide-react";
import type { Item } from "@/server/domain/items";
import { Button } from "@/web/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/web/components/ui/card";

interface ItemCardProps {
	item: Item;
	onDelete: (id: string) => void;
	onClick: () => void;
}

export function ItemCard({ item, onDelete, onClick }: ItemCardProps) {
	return (
		<Card className="cursor-pointer transition-colors hover:bg-muted/50">
			<CardHeader className="flex flex-row items-start justify-between space-y-0">
				<button type="button" className="ghost flex-1" onClick={onClick}>
					<CardTitle>{item.title}</CardTitle>
					<p className="mt-1 text-muted-foreground text-sm">
						{new Date(item.created).toLocaleDateString()}
					</p>
				</button>
				<Button
					variant="ghost"
					size="icon"
					onClick={(e) => {
						e.stopPropagation();
						onDelete(item.id);
					}}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</CardHeader>
			<CardContent onClick={onClick}>
				<p className="line-clamp-2 text-sm">{item.content}</p>
			</CardContent>
		</Card>
	);
}
