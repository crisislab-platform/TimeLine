import { TimeLinePlugin } from "../types";
import { getNearestPoint, isPointInBox } from "../utils";

/**
 * This plugin shows an HTMl popup with info about the nearest point to the mouse.
 * @param formatX A function to convert x-axis values into a human-readable format
 * @param formatY A function to convert y-axis values into a human-readable format
 * @returns {TimeLinePlugin}
 */
export const nearestPointInfoPopupPlugin = (
	formatX: (x: number) => string = (x) => x + "",
	formatY: (x: number) => string = (x) => x + "",
): TimeLinePlugin => ({
	data: {
		hoverText: document.createElement("div"),
		styleTag: document.createElement("style"),
	},
	construct: function (chart) {
		this.data.styleTag.innerText = `.crisislab-timeline-hover-text {
			display: block;
			position: absolute;
			background-color: white;
			color: black;
			padding: 5px;
			border: 1px solid black;
			top: 0px;
		}`;
		chart.container.appendChild(this.data.styleTag);
		this.data.hoverText.classList.add("crisislab-timeline-hover-text");
		chart.container.appendChild(this.data.hoverText);
	},
	"draw:after": function (chart) {
		// Check if the mouse is over the chart
		if (chart.helpfulInfo.cursor.overChart) {
			// Get the nearest point
			const point = getNearestPoint(chart, {
				x: chart.helpfulInfo.cursor.chartX,
				y: chart.helpfulInfo.cursor.chartY,
			});
			if (!point) {
				this.data.hoverText.style.display = "none";
				return;
			}

			// Text
			this.data.hoverText.innerText = `${chart.yLabel}: ${formatY(
				point.y,
			)}
${chart.xLabel}: ${formatX(point.x)}`;
			this.data.hoverText.style.display = "block";

			// Vertical positioning
			this.data.hoverText.style.top = chart.padding.top + "px";

			// Horizontal positioning
			if (
				chart.helpfulInfo.cursor.chartX >
				chart.widthInsidePadding / 2
			) {
				// The -1 is to avoid a double border
				this.data.hoverText.style.left = chart.padding.left + "px";
				this.data.hoverText.style.right = "unset";
			} else {
				this.data.hoverText.style.left = "unset";
				this.data.hoverText.style.right = chart.padding.right + "px";
			}
		} else {
			this.data.hoverText.style.display = "none";
		}
	},
});
