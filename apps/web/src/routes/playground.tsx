import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto max-w-5xl border-2 border-purple-500 p-4">
			<h1>Playground</h1>
		</div>
	);
}
