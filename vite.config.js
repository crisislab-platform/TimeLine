// @ts-check
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [dts()],
	optimizeDeps: {
		// This makes the examples work
		include: ["examples/**/*"],
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "TimeLine",
			fileName: "TimeLine",
			formats: ["es", "umd"],
		},
	},
});
