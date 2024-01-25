import { DistanceMethod, TimeLinePlugin } from "../types";
import { getNearestPoint } from "../utils";

/**
 * This plugin draws a marker on the nearest point to the mouse, when the mouse is over the canvas.
 * @param distanceMethod The method by which to get the distance to points from the cursor
 * @returns {TimeLinePlugin}
 */
export const doubleClickCopyPlugin = (
	distanceMethod?: DistanceMethod,
): TimeLinePlugin => ({
	construct: function (chart) {
		if ("clipboard" in navigator) {
			chart.container.addEventListener("dblclick", (event) => {
				// On double click, copy data to clipboard
				const rect = chart.canvas.getBoundingClientRect();

				const point = getNearestPoint(
					chart,
					{
						x: event.clientX - rect.x,
						y: event.clientY - rect.y,
					},
					distanceMethod,
				);
				if (!point) return;
				try {
					// Write in a spreadsheet-pasteable format
					navigator.clipboard
						.writeText(`${chart.valueAxisLabel}	${point.value}
${chart.valueAxisLabel}	${point.time}`);
				} catch (err) {
					console.warn("Error writing to clipboard: ", err);
				}
			});
		} else {
			console.warn(
				"Clipboard API not found - double click to copy won't work",
			);
		}
	},
});
