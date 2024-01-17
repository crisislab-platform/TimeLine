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
 * @param side The side of the graph to render the axis on
 * @returns {TimeLinePlugin}
 */
export const xAxisPlugin = (
	formatLabel: (x: number) => string = (x) => x + "",
	xMarks = 5,
	side: "top" | "bottom" = "bottom",
): TimeLinePlugin => ({
	construct: (chart) => {
		chart.padding[side] += 30;
	},
	"draw:after": (chart) => {
		const onBottom = side === "bottom";
		// Set font properties
		chart.ctx.font = labelFont;
		chart.ctx.fillStyle = chart.foregroundColour;
		chart.ctx.textAlign = "start";
		chart.ctx.textBaseline = onBottom ? "top" : "bottom";

		const xPointGap = Math.floor(chart.maxPoints / xMarks);

		for (let i = 0; i < xMarks; i++) {
			const point = chart.computedData[i * xPointGap];
			if (!point) continue;
			const renderY = onBottom
				? chart.heightInsidePadding + chart.padding.top
				: chart.padding.top;

			const label = formatLabel(point.x);
			const textX = point.renderX + 5;
			const textY = renderY + (onBottom ? axisGap : -axisGap);

			// Marker
			chart.ctx.beginPath();
			chart.ctx.moveTo(point.renderX, renderY);
			chart.ctx.lineTo(
				point.renderX,
				renderY + (onBottom ? tickLength : -tickLength),
			);
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
 * @param side The side of the graph to render the axis on
 * @returns {TimeLinePlugin}
 */
export const yAxisPlugin = (
	formatLabel: (y: number) => string = (y) => y + "",
	yMarks = 5,
	side: "left" | "right" = "left",
): TimeLinePlugin => ({
	construct: (chart) => {
		chart.padding[side] += 40;
	},
	"draw:after": (chart) => {
		const onLeft = side === "left";
		const { yOffset, yMultiplier } = chart.getRenderOffsetsAndMultipliers();

		// Set font properties
		chart.ctx.font = labelFont;
		chart.ctx.fillStyle = chart.foregroundColour;
		chart.ctx.textAlign = onLeft ? "right" : "left";
		chart.ctx.textBaseline = "top";
		chart.ctx.fillStyle = chart.foregroundColour;

		const relevantChartContentEdgeX = onLeft
			? chart.padding.left
			: chart.padding.left + chart.widthInsidePadding;

		for (let i = 0; i < yMarks; i++) {
			const yValue = (i * chart.heightInsidePadding) / (yMarks - 1);
			const yRenderPosition = yValue + chart.padding.top + 1;
			const yDataValue =
				(chart.heightInsidePadding - yValue) / yMultiplier - yOffset;

			const textX =
				relevantChartContentEdgeX + (onLeft ? -axisGap : axisGap);
			const textY = yRenderPosition + axisGap; // Move down so it doesn't overlap the line
			const label = formatLabel(yDataValue);

			//Marker
			chart.ctx.beginPath();
			chart.ctx.moveTo(
				relevantChartContentEdgeX + (onLeft ? -tickLength : tickLength),
				yRenderPosition,
			);
			chart.ctx.lineTo(relevantChartContentEdgeX, yRenderPosition);
			chart.ctx.stroke();

			// Label
			chart.ctx.fillText(label, textX, textY);
		}
	},
});
