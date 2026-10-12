import { Hono } from "hono";
import { rateLimit, rateLimitPassed } from "./index";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.use("/api/*", async (c, next) => {
	const rateLimiter = rateLimit(c.env.RATE_LIMITER, (c) => c.req.header("Authorization") || "");
	return rateLimiter(c, next);
});

app.get("/api/hello", (c) => {
	const passed = rateLimitPassed(c);
	return c.json({ message: "Hello!", rateLimitPassed: passed });
});

app.get("/health", (c) => {
	return c.json({ status: "ok" });
});

export default app;
