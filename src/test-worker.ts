import { Hono } from "hono";
import { rateLimit, wasRateLimited, RateLimitBinding } from "./index";

// Type for the test environment with rate limiter binding
export interface Env {
	RATE_LIMITER: RateLimitBinding;
}

const app = new Hono<{ Bindings: Env }>();

// Apply rate limiting middleware using IP address as key
app.use("/api/*", async (c, next) => {
	const rateLimiter = rateLimit(
		c.env.RATE_LIMITER,
		(c) => c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For") || "anonymous"
	);
	return rateLimiter(c, next);
});

// Endpoint that checks if rate limited
app.get("/api/hello", (c) => {
	const rateLimited = wasRateLimited(c);
	return c.json({ message: "Hello!", rateLimited });
});

// Endpoint without rate limiting for comparison
app.get("/health", (c) => {
	return c.json({ status: "ok" });
});

export default app;
