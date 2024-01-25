// @ts-check
import "dotenv/config";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const buildSiteMode = process.env.BUILD_SITE_NOT_LIBRARY === "yes";

export default defineConfig({
	plugins: [dts()],
	optimizeDeps: {
		// This makes the examples work
		include: ["examples/**/*"],
	},
	build: {
		lib: buildSiteMode
			? undefined
			: {
					entry: resolve(__dirname, "src/index.ts"),
					name: "TimeLine",
					fileName: "TimeLine",
					formats: ["es", "umd"],
				},
	},
});
