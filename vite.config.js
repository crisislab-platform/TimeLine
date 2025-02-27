// @ts-check
import "dotenv/config";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdir } from "node:fs/promises";

// Credit https://stackoverflow.com/a/24594123
const getDirectories = async (source) =>
	(await readdir(source, { withFileTypes: true }))
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

const __dirname = dirname(fileURLToPath(import.meta.url));

const buildSiteMode = process.env.BUILD_SITE_NOT_LIBRARY === "yes";
console.info("Build site mode:", buildSiteMode);
export default defineConfig({
	plugins: [!buildSiteMode && dts({ rollupTypes: true })],
	optimizeDeps: {
		// This makes the examples work
		include: ["examples/**/*"],
	},
	build: {
		rollupOptions: buildSiteMode
			? {
					input: {
						...Object.fromEntries(
							(
								await getDirectories(
									resolve(__dirname, "examples"),
								)
							).map((dir) => [dir, `examples/${dir}/index.html`]),
						),
						"examples-home": "examples/index.html",
					},
				}
			: undefined,
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
