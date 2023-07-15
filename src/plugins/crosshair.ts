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

			// Thinner line
			chart.ctx.lineWidth = 0.5;

			// Dashed line
			chart.ctx.setLineDash([10, 10]);

			// Horizontal line
			if (chartY < chart.heightWithoutPadding) {
				chart.ctx.beginPath();
				chart.ctx.moveTo(chart.leftPadding, chartY);
				chart.ctx.lineTo(chart.width, chartY);
				chart.ctx.stroke();
			}

			// Vertical line
			if (chartX > chart.leftPadding) {
				chart.ctx.beginPath();
				chart.ctx.moveTo(chartX, 0);
				chart.ctx.lineTo(chartX, chart.heightWithoutPadding);
				chart.ctx.stroke();
			}
		}

		// Reset line dash
		chart.ctx.setLineDash([]);
	},
});
