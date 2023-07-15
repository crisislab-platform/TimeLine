import { TimeLinePlugin } from "../types";

// Consistency
const labelFontSize = 12;
const axisGap = 4;
const tickLength = 18;
const labelFont = `${labelFontSize}px Arial`;

/**
 * This plugin draws an x-axis on the chart.
 * @param formatLabel A function that converts an x-axis value to a human-readable format
 * @param xMarks The number of markers to show on the x-axis
 * @returns {TimeLinePlugin}
 */
export const xAxisPlugin = (
	formatLabel: (x: number) => string = (x) => x + "",
	xMarks = 5,
): TimeLinePlugin => ({
	construct: (chart) => {
		chart.padding.bottom += 30;
	},
	"draw:after": (chart) => {
		// Set font properties
		chart.ctx.font = labelFont;
		chart.ctx.fillStyle = chart.foregroundColour;
		chart.ctx.textAlign = "start";
		chart.ctx.textBaseline = "top";

		const xPointGap = Math.floor(chart.maxPoints / xMarks);

		for (let i = 0; i < xMarks; i++) {
			const point = chart.computedData[i * xPointGap];
			if (!point) continue;
			const renderY = chart.height - chart.padding.bottom;

			const label = formatLabel(point.x);
			const textX = point.renderX + 5;
			const textY = renderY + axisGap;

			// Marker
			chart.ctx.beginPath();
			chart.ctx.moveTo(point.renderX, renderY);
			chart.ctx.lineTo(point.renderX, renderY + tickLength);
			chart.ctx.stroke();

			// Label
			chart.ctx.fillText(label, textX, textY);
		}
	},
});

/**
 * This plugin draws a y-axis on the chart.
 * @param formatLabel A function that converts an y-axis value to a human-readable format
 * @param yMarks The number of markers to show on the y-axis
 * @returns {TimeLinePlugin}
 */
export const yAxisPlugin = (
	formatLabel: (y: number) => string = (y) => y + "",
	yMarks = 5,
): TimeLinePlugin => ({
	construct: (chart) => {
		chart.padding.left += 40;
	},
	"draw:after": (chart) => {
		const { yOffset, yMultiplier } = chart.getRenderOffsetsAndMultipliers();

		// Set font properties
		chart.ctx.font = labelFont;
		chart.ctx.fillStyle = chart.foregroundColour;
		chart.ctx.textAlign = "right";
		chart.ctx.textBaseline = "top";
		chart.ctx.fillStyle = chart.foregroundColour;

		for (let i = 0; i < yMarks; i++) {
			const yValue = (i * chart.heightInsidePadding) / (yMarks - 1);
			const yRenderPosition = yValue + chart.padding.top;
			const yDataValue =
				(chart.heightInsidePadding - yValue) / yMultiplier - yOffset;

			const textX = chart.padding.left - axisGap;
			const textY = yRenderPosition + axisGap; // Move down so it doesn't overlap the line
			const label = formatLabel(yDataValue);

			//Marker
			chart.ctx.beginPath();
			chart.ctx.moveTo(chart.padding.left - tickLength, yRenderPosition);
			chart.ctx.lineTo(chart.padding.left, yRenderPosition);
			chart.ctx.stroke();

			// Label
			chart.ctx.fillText(label, textX, textY);
		}
	},
});
