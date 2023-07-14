import { TimeLinePlugin } from "../types";
import { getNearestPoint, isPointInBox } from "../utils";

/**
 * This plugin draws a marker on the nearest point to the mouse, when the mouse is over the canvas.
 * @returns {TimeLinePlugin}
 */
export const highlightNearestPoint = (): TimeLinePlugin => ({
	data: {
		mouseX: -1,
		mouseY: -1,
	},
	construct: function () {
		window.addEventListener("mousemove", (event) => {
			this.data.mouseX = event.pageX;
			this.data.mouseY = event.pageY;
		});
	},
	"draw:after": function (chart) {
		const rect = chart.canvas.getBoundingClientRect();
		// Check if the mouse is over the chart
		if (
			isPointInBox(
				this.data.mouseX,
				this.data.mouseY,
				rect.x,
				rect.y,
				rect.width,
				rect.height,
			)
		) {
			const chartX = this.data.mouseX - rect.x;
			const chartY = this.data.mouseY - rect.y;

			// Get the nearest point
			const point = getNearestPoint(chart, { x: chartX, y: chartY });
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
