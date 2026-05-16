import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		include: ["tests/**/*.{test,spec}.{js,ts}"],
		// Per-file environment is set via `// @vitest-environment jsdom` comments.
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			include: ["src/**/*.{js,ts}"],
		},
	},
});
