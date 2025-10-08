import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { db } from "@/server/infra/db";
import * as schema from "@/server/infra/db/schema/auth";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: schema,
	}),
	trustedOrigins: [env.CORS_ORIGIN],
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	basePath: "/api/auth",
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
				console.log(`🔑 Verification code for ${email}: ${otp}`);
			},
		}),
	],
	secondaryStorage: {
		get: async (key) => {
			const value = await env.SESSION_KV.get(key);
			return value;
		},
		set: async (key, value, ttl) => {
			if (ttl) {
				await env.SESSION_KV.put(key, value, { expirationTtl: ttl });
			} else {
				await env.SESSION_KV.put(key, value);
			}
		},
		delete: async (key) => {
			await env.SESSION_KV.delete(key);
		},
	},
	rateLimit: {
		storage: "secondary-storage",
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
});
