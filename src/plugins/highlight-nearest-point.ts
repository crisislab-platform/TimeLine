import { DistanceMethod, TimeLinePlugin } from "../types";
import { getNearestPoint } from "../utils";

/**
 * This plugin draws a marker on the nearest point to the mouse, when the mouse is over the canvas.
 * @param distanceMethod The method by which to get the distance to points from the cursor
 * @returns {TimeLinePlugin}
 */
export const highlightNearestPointPlugin = (
	distanceMethod?: DistanceMethod,
): TimeLinePlugin => ({
	"draw:after": function (chart) {
		// Check if the mouse is over the chart
		if (chart.helpfulInfo.cursor.overChart) {
			// Get the nearest point
			const point = getNearestPoint(
				chart,
				{
					x: chart.helpfulInfo.cursor.chartX,
					y: chart.helpfulInfo.cursor.chartY,
				},
				distanceMethod,
			);
			if (!point) {
				return;
			}

			// Ticker line
			chart.ctx.lineWidth = 1.2;

			// Draw a marker on it
			const r = 10;
			chart.ctx.beginPath();
			chart.ctx.arc(point.renderX, point.renderY, r, 0, 2 * Math.PI);
			chart.ctx.stroke();

			// Crosshair
			chart.ctx.beginPath();
			chart.ctx.moveTo(point.renderX, point.renderY - r);
			chart.ctx.lineTo(point.renderX, point.renderY + r);
			chart.ctx.stroke();
			chart.ctx.beginPath();
			chart.ctx.moveTo(point.renderX - r, point.renderY);
			chart.ctx.lineTo(point.renderX + r, point.renderY);
			chart.ctx.stroke();
		}
	},
});
