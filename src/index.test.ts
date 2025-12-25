import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { RateLimitBinding, rateLimit, wasRateLimited } from ".";

// Mock rate limiter that always allows requests
class PassingRateLimiter implements RateLimitBinding {
	async limit(_: { key: string }) {
		return { success: true };
	}
}

// Mock rate limiter that always denies requests
class FailingRateLimiter implements RateLimitBinding {
	async limit(_: { key: string }) {
		return { success: false };
	}
}

describe("rateLimit middleware", () => {
	it("allows requests when rate limit is not exceeded", async () => {
		const app = new Hono();
		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(new PassingRateLimiter(), () => "testKey")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.text("Hello"));

		const res = await app.request("http://localhost/api/hello");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello");
	});

	it("returns 429 when rate limit is exceeded", async () => {
		const app = new Hono();
		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(new FailingRateLimiter(), () => "testKey")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.text("Hello"));

		const res = await app.request("http://localhost/api/hello");
		expect(res.status).toBe(429);
		expect(await res.text()).toBe("rate limited");
	});

	it("bypasses rate limiting when keyFunc returns empty string", async () => {
		const app = new Hono();
		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(new FailingRateLimiter(), () => "")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.text("Hello"));

		const res = await app.request("http://localhost/api/hello");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello");
	});

	it("supports async keyFunc", async () => {
		const app = new Hono();
		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(new PassingRateLimiter(), async () => {
				await Promise.resolve();
				return "asyncKey";
			})(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.text("Hello"));

		const res = await app.request("http://localhost/api/hello");
		expect(res.status).toBe(200);
	});

	it("passes the correct key to the rate limiter", async () => {
		const app = new Hono();
		let capturedKey = "";

		const trackingLimiter: RateLimitBinding = {
			async limit({ key }) {
				capturedKey = key;
				return { success: true };
			},
		};

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(trackingLimiter, (c) => c.req.header("X-API-Key") || "anonymous")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.text("Hello"));

		await app.request("http://localhost/api/hello", {
			headers: { "X-API-Key": "my-secret-key" },
		});
		expect(capturedKey).toBe("my-secret-key");
	});
});

describe("wasRateLimited helper", () => {
	it("returns true when request passed rate limiting", async () => {
		const app = new Hono();
		let rateLimitStatus: boolean | undefined;

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(new PassingRateLimiter(), () => "testKey")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => {
			rateLimitStatus = wasRateLimited(c);
			return c.text("Hello");
		});

		await app.request("http://localhost/api/hello");
		expect(rateLimitStatus).toBe(true);
	});
});
