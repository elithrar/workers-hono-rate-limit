import { describe, it, expect, beforeEach } from "vitest";
import { exports } from "cloudflare:workers";
import { reset } from "cloudflare:test";

describe("test-worker integration", () => {
	beforeEach(async () => {
		await reset();
	});

	it("returns 200 from /health without rate limiting", async () => {
		const res = await exports.default.fetch("http://localhost/health");
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ status: "ok" });
	});

	it("rate limits /api/hello when the binding limit is exceeded", async () => {
		const headers = { Authorization: "Bearer integration-test-token" };

		for (let i = 0; i < 3; i++) {
			const res = await exports.default.fetch("http://localhost/api/hello", { headers });
			expect(res.status).toBe(200);
			const body = await res.json<{ rateLimitPassed: boolean }>();
			expect(body.rateLimitPassed).toBe(true);
		}

		const res = await exports.default.fetch("http://localhost/api/hello", { headers });
		expect(res.status).toBe(429);
		expect(await res.text()).toBe("rate limited");
	});

	it("bypasses rate limiting for requests without an Authorization header", async () => {
		for (let i = 0; i < 5; i++) {
			const res = await exports.default.fetch("http://localhost/api/hello");
			expect(res.status).toBe(200);
			const body = await res.json<{ rateLimitPassed: boolean | undefined }>();
			expect(body.rateLimitPassed).toBeUndefined();
		}
	});
});
