import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["src/index"],
	declaration: true,
	rollup: {
		emitCJS: true,
	},
	externals: ["hono", "hono/factory", "hono/http-exception"],
});
