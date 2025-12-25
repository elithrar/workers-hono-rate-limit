import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
	test: {
		globals: true,
		poolOptions: {
			workers: {
				main: "./src/test-worker.ts",
				miniflare: {
					compatibilityDate: "2024-12-25",
				},
			},
		},
	},
});
