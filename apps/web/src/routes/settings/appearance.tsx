import { createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "@/web/components/navigation/mode-toggle";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/web/components/ui/card";

export const Route = createFileRoute("/settings/appearance")({
	component: AppearanceSettings,
});

function AppearanceSettings() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
					<div>
						<CardTitle className="mb-1.5">Theme</CardTitle>
						<CardDescription>
							Toggle between light and dark mode.
						</CardDescription>
					</div>
					<ModeToggle />
				</CardHeader>
			</Card>
		</div>
	);
}
