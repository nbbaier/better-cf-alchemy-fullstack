import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/web/components/ui/button";
import { useIsMobile } from "@/web/hooks/use-mobile";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

const SETTINGS_SIDEBAR_EVENT = "better-chat:open-settings";

export default function Header() {
	const location = useRouterState({ select: (state) => state.location });
	const isMobile = useIsMobile();
	const pathname = location.pathname ?? "";
	const isSettingsRoute = pathname.startsWith("/settings");
	const showSidebarToggle = isMobile && isSettingsRoute;

	const handleToggleSidebar = () => {
		if (isSettingsRoute) {
			window.dispatchEvent(new CustomEvent(SETTINGS_SIDEBAR_EVENT));
		}
	};

	return (
		<div className="border-2 border-green-500 bg-backgroundh px-4">
			<header className="w-full border-b">
				<nav className="mx-auto flex max-w-5xl items-center justify-between border-2 border-yellow-500 py-4 sm:text-red-200 md:text-blue-200 lg:text-green-200">
					<div className="flex items-center gap-2">
						{showSidebarToggle && (
							<Button
								variant="ghost"
								size="icon"
								onClick={handleToggleSidebar}
								className="md:hidden"
							>
								<Menu className="size-5" />
							</Button>
						)}
						<Link
							to="/"
							className="flex items-center gap-2 font-semibold text-lg text-primary"
						>
							<span className="text-3xl" />
						</Link>
					</div>
					<div className="flex items-center gap-2">
						<UserMenu />
						{/* <ModeToggle /> */}
					</div>
				</nav>
			</header>
		</div>
	);
}
