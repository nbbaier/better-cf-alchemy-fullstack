import type { PropsWithChildren } from "react";
import { cn } from "@/web/utils/cn";

interface BackgroundLayoutProps extends PropsWithChildren {
	className?: string;
	contentClassName?: string;
}

export function BackgroundLayout({
	children,
	className,
	contentClassName,
}: BackgroundLayoutProps) {
	return (
		<div className={cn("min-h-screen bg-background", className)}>
			<div className={contentClassName}>{children}</div>
		</div>
	);
}
