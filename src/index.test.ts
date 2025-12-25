import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { RateLimitBinding, rateLimit, rateLimitPassed } from "./index";

// =============================================================================
// Mock Rate Limiters (using factory functions for better serialization)
// =============================================================================

// Creates a rate limiter that always allows requests
function createPassingRateLimiter(): RateLimitBinding {
	return {
		limit: async (_: { key: string }) => ({ success: true }),
	};
}

// Creates a rate limiter that always denies requests
function createFailingRateLimiter(): RateLimitBinding {
	return {
		limit: async (_: { key: string }) => ({ success: false }),
	};
}

// Creates a rate limiter that tracks calls and enforces a limit
function createTrackingRateLimiter(maxRequests = 10) {
	const calls: Array<{ key: string; timestamp: number }> = [];
	const requestCounts = new Map<string, number>();

	return {
		calls,
		limiter: {
			limit: async ({ key }: { key: string }) => {
				calls.push({ key, timestamp: Date.now() });
				const count = (requestCounts.get(key) || 0) + 1;
				requestCounts.set(key, count);
				return { success: count <= maxRequests };
			},
		} as RateLimitBinding,
		reset: () => {
			calls.length = 0;
			requestCounts.clear();
		},
	};
}

// =============================================================================
// Unit Tests - Core middleware functionality
// =============================================================================

describe("rateLimit middleware", () => {
	it("allows requests when rate limit is not exceeded", async () => {
		const app = new Hono();
		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(createPassingRateLimiter(), () => "testKey")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.text("Hello"));

		const res = await app.request("http://localhost/api/hello");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello");
	});

	it("returns 429 when rate limit is exceeded", async () => {
		const app = new Hono();
		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(createFailingRateLimiter(), () => "testKey")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.text("Hello"));

		const res = await app.request("http://localhost/api/hello");
		expect(res.status).toBe(429);
		expect(await res.text()).toBe("rate limited");
	});

	it("bypasses rate limiting when keyFunc returns empty string", async () => {
		const app = new Hono();
		const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(createFailingRateLimiter(), () => "")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.text("Hello"));

		const res = await app.request("http://localhost/api/hello");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello");
		expect(consoleSpy).toHaveBeenCalledWith(
			"the provided keyFunc returned an empty rate limiting key: bypassing rate limits"
		);

		consoleSpy.mockRestore();
	});

	it("supports async keyFunc", async () => {
		const app = new Hono();
		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(createPassingRateLimiter(), async () => {
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
			limit: async ({ key }) => {
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

	it("uses request context to generate dynamic keys", async () => {
		const app = new Hono();
		const capturedKeys: string[] = [];

		const trackingLimiter: RateLimitBinding = {
			limit: async ({ key }) => {
				capturedKeys.push(key);
				return { success: true };
			},
		};

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(trackingLimiter, (c) => {
				const ip = c.req.header("CF-Connecting-IP") || "unknown";
				const path = new URL(c.req.url).pathname;
				return `${ip}:${path}`;
			})(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/users", (c) => c.text("Users"));
		app.get("/api/posts", (c) => c.text("Posts"));

		await app.request("http://localhost/api/users", {
			headers: { "CF-Connecting-IP": "192.168.1.1" },
		});
		await app.request("http://localhost/api/posts", {
			headers: { "CF-Connecting-IP": "192.168.1.1" },
		});

		expect(capturedKeys).toEqual(["192.168.1.1:/api/users", "192.168.1.1:/api/posts"]);
	});
});

describe("rateLimitPassed helper", () => {
	it("returns true when request passed rate limiting", async () => {
		const app = new Hono();
		let rateLimitStatus: boolean | undefined;

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(createPassingRateLimiter(), () => "testKey")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => {
			rateLimitStatus = rateLimitPassed(c);
			return c.text("Hello");
		});

		await app.request("http://localhost/api/hello");
		expect(rateLimitStatus).toBe(true);
	});

	it("returns undefined when rate limiting middleware was not applied", async () => {
		const app = new Hono();
		let rateLimitStatus: boolean | undefined;

		app.get("/api/hello", (c) => {
			rateLimitStatus = rateLimitPassed(c);
			return c.text("Hello");
		});

		await app.request("http://localhost/api/hello");
		expect(rateLimitStatus).toBeUndefined();
	});
});

// =============================================================================
// Integration-style Tests - Simulating real-world rate limiting behavior
// =============================================================================

describe("rateLimit integration behavior", () => {
	it("should allow requests within the rate limit", async () => {
		const tracker = createTrackingRateLimiter(3); // Allow 3 requests before rate limiting
		const app = new Hono();
		const ip = "192.168.1.1";

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(tracker.limiter, (c) => c.req.header("X-Forwarded-For") || "anonymous")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.json({ message: "Hello!" }));

		// First 3 requests should succeed
		for (let i = 0; i < 3; i++) {
			const res = await app.request("http://localhost/api/hello", {
				headers: { "X-Forwarded-For": ip },
			});
			expect(res.status).toBe(200);
			const body = await res.json();
			expect(body).toEqual({ message: "Hello!" });
		}

		expect(tracker.calls.length).toBe(3);
		expect(tracker.calls.every((call) => call.key === ip)).toBe(true);
	});

	it("should block requests that exceed the rate limit", async () => {
		const tracker = createTrackingRateLimiter(3);
		const app = new Hono();
		const ip = "10.0.0.42";

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(tracker.limiter, (c) => c.req.header("X-Forwarded-For") || "anonymous")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.json({ message: "Hello!" }));

		// First 3 requests should succeed
		for (let i = 0; i < 3; i++) {
			const res = await app.request("http://localhost/api/hello", {
				headers: { "X-Forwarded-For": ip },
			});
			expect(res.status).toBe(200);
		}

		// 4th request should be rate limited
		const res = await app.request("http://localhost/api/hello", {
			headers: { "X-Forwarded-For": ip },
		});
		expect(res.status).toBe(429);
		expect(await res.text()).toBe("rate limited");
	});

	it("should track different IPs separately", async () => {
		const tracker = createTrackingRateLimiter(3);
		const app = new Hono();
		const ip1 = "172.16.0.1";
		const ip2 = "172.16.0.2";

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(tracker.limiter, (c) => c.req.header("X-Forwarded-For") || "anonymous")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.json({ message: "Hello!" }));

		// 3 requests from IP1
		for (let i = 0; i < 3; i++) {
			const res = await app.request("http://localhost/api/hello", {
				headers: { "X-Forwarded-For": ip1 },
			});
			expect(res.status).toBe(200);
		}

		// IP1 is now rate limited
		const rateLimitedRes = await app.request("http://localhost/api/hello", {
			headers: { "X-Forwarded-For": ip1 },
		});
		expect(rateLimitedRes.status).toBe(429);

		// But IP2 can still make requests
		const res = await app.request("http://localhost/api/hello", {
			headers: { "X-Forwarded-For": ip2 },
		});
		expect(res.status).toBe(200);
	});

	it("should not affect routes without rate limiting middleware", async () => {
		const tracker = createTrackingRateLimiter(3);
		const app = new Hono();

		const rateLimiter: MiddlewareHandler = (c, next) =>
			rateLimit(tracker.limiter, (c) => c.req.header("X-Forwarded-For") || "anonymous")(c, next);

		app.use("/api/*", rateLimiter);
		app.get("/api/hello", (c) => c.json({ message: "Hello!" }));
		app.get("/health", (c) => c.json({ status: "ok" }));

		// Health endpoint is not under /api/* so rate limiting doesn't apply
		for (let i = 0; i < 10; i++) {
			const res = await app.request("http://localhost/health");
			expect(res.status).toBe(200);
		}

		// No rate limiting calls should have been made
		expect(tracker.calls.length).toBe(0);
	});

	it("should work with Hono env bindings pattern", async () => {
		// This test demonstrates the recommended usage pattern with Cloudflare Workers env
		interface Env {
			RATE_LIMITER: RateLimitBinding;
		}

		const tracker = createTrackingRateLimiter(5);
		const envApp = new Hono<{ Bindings: Env }>();

		envApp.use("/api/*", async (c, next) => {
			const limiter = rateLimit(c.env.RATE_LIMITER, (c) => c.req.header("Authorization") || "anon");
			return limiter(c, next);
		});
		envApp.get("/api/data", (c) => c.json({ data: "secret" }));

		// Simulate the env being passed (as Cloudflare Workers does)
		const env: Env = { RATE_LIMITER: tracker.limiter };

		const res = await envApp.request(
			"http://localhost/api/data",
			{
				headers: { Authorization: "Bearer token123" },
			},
			env
		);

		expect(res.status).toBe(200);
		expect(tracker.calls[0].key).toBe("Bearer token123");
	});
});
