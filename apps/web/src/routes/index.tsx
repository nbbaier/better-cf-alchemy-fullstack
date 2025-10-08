import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GuestShellSkeleton } from "@/web/components/guest-skeleton";
import { Button } from "@/web/components/ui/button";
import { authClient } from "@/web/lib/auth-client";
import { redirectIfAuthenticated } from "@/web/lib/route-guards";

export const Route = createFileRoute("/")({
	beforeLoad: async (opts) => {
		await redirectIfAuthenticated({ auth: opts.context.auth, to: "/items" });
	},
	component: GuestRoute,
	pendingComponent: GuestShellSkeleton,
});

function GuestRoute() {
	const { data: session, isPending } = authClient.useSession();
	if (isPending) {
		return <GuestShellSkeleton />;
	}

	if (session?.user) {
		return <Navigate to="/items" replace />;
	}

	return <GuestLanding />;
}

function GuestLanding() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4">
			<div className="mx-auto w-full max-w-2xl space-y-8 text-center">
				<h1 className="font-bold text-4xl sm:text-5xl md:text-6xl">
					Cloudflare Template
				</h1>
				<p className="text-lg text-muted-foreground sm:text-xl">
					Full-stack template with Cloudflare Workers, Durable Objects, and D1
				</p>
				<div className="flex justify-center gap-4">
					<Button asChild size="lg">
						<a href="/auth/sign-in">Get Started</a>
					</Button>
				</div>
			</div>
		</div>
	);
}
