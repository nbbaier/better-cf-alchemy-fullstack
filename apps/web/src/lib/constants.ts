export const SITE_NAME = "cloudflare-template";
export const SITE_DESCRIPTION = "Full-stack Cloudflare template";

export const SIGN_IN_FORM = {
	OTP_LENGTH: 6,
	VALIDATION_MESSAGES: {
		EMAIL_INVALID: "Invalid email address",
		OTP_INVALID: "OTP must be at least 6 characters",
	},
	SUCCESS_MESSAGES: {
		OTP_SENT: "Verification code sent to your email",
		SIGN_IN_SUCCESS: "Sign in successful",
	},
	LOADING_MESSAGES: {
		SENDING_OTP: "Sending code...",
		VERIFYING_OTP: "Verifying...",
	},
} as const;

export const SETTINGS_NAV_ITEMS = [
	{
		to: "/settings/profile",
		label: "Profile",
		description: "View session details",
	},
	{
		to: "/settings/appearance",
		label: "Appearance",
		description: "Change theme",
	},
] as const;

export type TechStackItem = {
	name: string;
	href: string;
	suffix?: string;
};

export type TechStackSection = {
	title: string;
	items: TechStackItem[];
};

export const TECH_STACK_SECTIONS: TechStackSection[] = [
	{
		title: "Frontend",
		items: [
			{
				name: "Vite",
				href: "https://vite.dev/guide",
				suffix: " with React 19",
			},
			{
				name: "TanStack Router",
				href: "https://tanstack.com/router/latest/docs/framework/react/overview",
				suffix: " for file-based routing",
			},
			{
				name: "TanStack Query",
				href: "https://tanstack.com/query/latest/docs/framework/react/overview",
				suffix: " for data fetching and caching",
			},
			{
				name: "oRPC",
				href: "https://github.com/unnoq/orpc",
				suffix: " for type-safe API calls",
			},
			{
				name: "Tailwind CSS 4",
				href: "https://tailwindcss.com/docs/installation/using-vite",
				suffix: " for styling",
			},
			{
				name: "shadcn/ui",
				href: "https://ui.shadcn.com/docs",
				suffix: " for UI components",
			},
			{
				name: "Server Mono",
				href: "https://servermono.com",
				suffix: " font from internet.dev",
			},
			{
				name: "Vercel AI SDK",
				href: "https://ai-sdk.dev/docs/introduction",
				suffix: " for streaming AI responses",
			},
			{
				name: "React Markdown",
				href: "https://remarkjs.github.io/react-markdown/",
				suffix: " for markdown rendering",
			},
			{
				name: "Shiki",
				href: "https://shiki.style/guide",
				suffix: " for syntax highlighting",
			},
		],
	},
	{
		title: "Backend",
		items: [
			{
				name: "Cloudflare Workers",
				href: "https://developers.cloudflare.com/workers/",
				suffix: " for serverless compute",
			},
			{
				name: "Hono",
				href: "https://hono.dev/docs",
				suffix: " for HTTP routing",
			},
			{
				name: "oRPC",
				href: "https://github.com/unnoq/orpc",
				suffix: " for type-safe RPC",
			},
			{
				name: "Drizzle ORM",
				href: "https://orm.drizzle.team/docs/overview",
				suffix: " for database operations",
			},
			{
				name: "Better Auth",
				href: "https://better-auth.com/docs/introduction",
				suffix: " for authentication",
			},
			{
				name: "Vercel AI SDK",
				href: "https://ai-sdk.dev/docs/introduction",
				suffix: " for AI provider integration",
			},
			{
				name: "Resend",
				href: "https://resend.com/docs/introduction",
				suffix: " for email delivery (production)",
			},
		],
	},
	{
		title: "Infrastructure",
		items: [
			{
				name: "Cloudflare D1",
				href: "https://developers.cloudflare.com/d1/",
				suffix: ": Central SQLite database",
			},
			{
				name: "Cloudflare Durable Objects",
				href: "https://developers.cloudflare.com/durable-objects/",
				suffix: ": Per-user stateful storage",
			},
			{
				name: "Cloudflare KV",
				href: "https://developers.cloudflare.com/kv/",
				suffix: ": Session and cache storage",
			},
			{
				name: "Alchemy",
				href: "https://alchemy.run/getting-started",
				suffix: ": Multi-stage deployment and resource management",
			},
			{
				name: "Better-T-Stack",
				href: "https://better-t-stack.dev",
				suffix: ": Project scaffold",
			},
		],
	},
];
