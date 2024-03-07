import { TimeLinePlugin } from "../types";

/**
 * This plugin draws a crosshair when the mouse is on the canvas
 * @returns {TimeLinePlugin}
 */
export const pointerCrosshairPlugin = (): TimeLinePlugin => ({
	construct(chart) {
		if (chart.host.type !== "browser")
			throw "pointerCrosshairPlugin requires a browser host!";
	},
	"draw:after": function (chart) {
		if (chart.host.type !== "browser")
			throw "pointerCrosshairPlugin requires a browser host!";

		// Check if the mouse is over the chart
		if (chart.host.cursorInfo.overChart) {
			// Thinner line
			chart.ctx.lineWidth = 0.5;

			// Dashed line
			chart.ctx.setLineDash([10, 10]);

			// Horizontal line
			if (
				chart.host.cursorInfo.chartX > chart.padding.top &&
				chart.host.cursorInfo.chartY <
					chart.height - chart.padding.bottom
			) {
				chart.ctx.beginPath();
				chart.ctx.moveTo(
					chart.padding.left,
					chart.host.cursorInfo.chartY,
				);
				chart.ctx.lineTo(
					chart.width - chart.padding.right,
					chart.host.cursorInfo.chartY,
				);
				chart.ctx.stroke();
			}

			// Vertical line
			if (
				chart.host.cursorInfo.chartX > chart.padding.left &&
				chart.host.cursorInfo.chartX < chart.width - chart.padding.right
			) {
				chart.ctx.beginPath();
				chart.ctx.moveTo(
					chart.host.cursorInfo.chartX,
					chart.padding.top,
				);
				chart.ctx.lineTo(
					chart.host.cursorInfo.chartX,
					chart.height - chart.padding.bottom,
				);
				chart.ctx.stroke();
			}
		}

		// Reset line dash
		chart.ctx.setLineDash([]);
	},
});
