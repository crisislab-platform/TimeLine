import { TimeLinePlugin } from "../types";
import { isPointInBox } from "../utils";

/**
 * This plugin draws a crosshair when the mouse is on the canvas
 * @returns {TimeLinePlugin}
 */
export const pointerCrosshairPlugin = (): TimeLinePlugin => ({
	data: {
		mouseX: -1,
		mouseY: -1,
	},
	construct: function (chart) {
		window.addEventListener("mousemove", (event) => {
			this.data.mouseX = event.clientX;
			this.data.mouseY = event.clientY;
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

			// Thinner line
			chart.ctx.lineWidth = 0.5;

			// Dashed line
			chart.ctx.setLineDash([10, 10]);

			// Horizontal line
			if (
				chartY > chart.padding.top &&
				chartY < chart.height - chart.padding.bottom
			) {
				chart.ctx.beginPath();
				chart.ctx.moveTo(chart.padding.left, chartY);
				chart.ctx.lineTo(chart.width - chart.padding.right, chartY);
				chart.ctx.stroke();
			}

			// Vertical line
			if (
				chartX > chart.padding.left &&
				chartX < chart.width - chart.padding.right
			) {
				chart.ctx.beginPath();
				chart.ctx.moveTo(chartX, chart.padding.top);
				chart.ctx.lineTo(chartX, chart.height - chart.padding.bottom);
				chart.ctx.stroke();
			}
		}

		// Reset line dash
		chart.ctx.setLineDash([]);
	},
});
