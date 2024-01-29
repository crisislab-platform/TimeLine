import { TimeLinePlugin } from "../types";

/**
 * This plugin draws a crosshair when the mouse is on the canvas
 * @returns {TimeLinePlugin}
 */
export const pointerCrosshairPlugin = (): TimeLinePlugin => ({
	"draw:after": function (chart) {
		// Check if the mouse is over the chart
		if (chart.helpfulInfo.cursor.overChart) {
			// Thinner line
			chart.ctx.lineWidth = 0.5;

			// Dashed line
			chart.ctx.setLineDash([10, 10]);

			// Horizontal line
			if (
				chart.helpfulInfo.cursor.chartX > chart.padding.top &&
				chart.helpfulInfo.cursor.chartY <
					chart.height - chart.padding.bottom
			) {
				chart.ctx.beginPath();
				chart.ctx.moveTo(
					chart.padding.left,
					chart.helpfulInfo.cursor.chartY,
				);
				chart.ctx.lineTo(
					chart.width - chart.padding.right,
					chart.helpfulInfo.cursor.chartY,
				);
				chart.ctx.stroke();
			}

			// Vertical line
			if (
				chart.helpfulInfo.cursor.chartX > chart.padding.left &&
				chart.helpfulInfo.cursor.chartX <
					chart.width - chart.padding.right
			) {
				chart.ctx.beginPath();
				chart.ctx.moveTo(
					chart.helpfulInfo.cursor.chartX,
					chart.padding.top,
				);
				chart.ctx.lineTo(
					chart.helpfulInfo.cursor.chartX,
					chart.height - chart.padding.bottom,
				);
				chart.ctx.stroke();
			}
		}

		// Reset line dash
		chart.ctx.setLineDash([]);
	},
});
