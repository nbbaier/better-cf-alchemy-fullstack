import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/items")({
	component: ItemsLayout,
});

function ItemsLayout() {
	return (
		<div className="container mx-auto max-w-4xl p-4">
			<Outlet />
		</div>
	);
}
