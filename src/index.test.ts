import { Hono, Context, MiddlewareHandler } from "hono";
import { RateLimitBinding, RateLimitKeyFunc, rateLimit } from ".";

type keyConfig = {
	key: string;
};

class PassingRateLimiter implements RateLimitBinding {
	async limit(_: keyConfig) {
		return { success: true };
	}
}

class FailingRateLimiter implements RateLimitBinding {
	async limit(_: keyConfig) {
		return { success: false };
	}
}

const passingRateLimiter: MiddlewareHandler = async (c, next) => {
	return await rateLimit(new PassingRateLimiter(), () => {
		return "someKey";
	})(c, next);
};

const failingRateLimiter: MiddlewareHandler = async (c, next) => {
	return await rateLimit(new FailingRateLimiter(), () => {
		return "someKey";
	})(c, next);
};

describe("rate limiting works as expected", () => {
	const app = new Hono();

	app.use("/passing/*", passingRateLimiter);
	app.get("/passing/hello", (c) => c.text(`${c.req.url}`));

	app.use("/failing/*", failingRateLimiter);
	app.get("/failing/hello", (c) => c.text(`${c.req.url}`));

	it("should not be rate limited", async () => {
		const res = await app.request("http://localhost/passing/hello");
		expect(res).not.toBeNull();
		expect(res.status).toBe(200);
	});

	it("should be rate limited", async () => {
		const res = await app.request("http://localhost/failing/hello");
		expect(res).not.toBeNull();
		expect(res.status).toBe(429);
	});
});
