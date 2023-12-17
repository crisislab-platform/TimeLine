import { TimeLinePlugin } from "../types";

// Consistency
const labelFontSize = 12;
const axisGap = 4;
const tickLength = 18;
const labelFont = `${labelFontSize}px Arial`;

/**
 * This plugin draws an x-axis on the chart.
 * @param formatLabel A function that converts an time-axis value to a human-readable format
 * @param timeMarks The number of markers to show on the time-axis
 * @returns {TimeLinePlugin}
 */
export const timeAxisPlugin = (
	formatLabel: (x: number) => string = (x) => x + "",
	timeMarks = 5,
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

		const timePointGap = Math.floor(chart.timeWindow / timeMarks);

		for (let i = 0; i < timeMarks; i++) {
			const point = chart.computedData[i * timePointGap];
			if (!point) continue;
			const renderY = chart.height - chart.padding.bottom;

			const label = formatLabel(point.time);
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
 * @param formatLabel A function that converts an value-axis value to a human-readable format
 * @param valueMarks The number of markers to show on the value-axis
 * @returns {TimeLinePlugin}
 */
export const valueAxisPlugin = (
	formatLabel: (y: number) => string = (y) => y + "",
	valueMarks = 5,
): TimeLinePlugin => ({
	construct: (chart) => {
		chart.padding.left += 40;
	},
	"draw:after": (chart) => {
		const { valueOffset, valueMultiplier } =
			chart.getRenderOffsetsAndMultipliers();

		// Set font properties
		chart.ctx.font = labelFont;
		chart.ctx.fillStyle = chart.foregroundColour;
		chart.ctx.textAlign = "right";
		chart.ctx.textBaseline = "top";
		chart.ctx.fillStyle = chart.foregroundColour;

		for (let i = 0; i < valueMarks; i++) {
			const value = (i * chart.heightInsidePadding) / (valueMarks - 1);
			const yRenderPosition = value + chart.padding.top;
			const yDataValue =
				(chart.heightInsidePadding - value) / valueMultiplier -
				valueOffset;

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
