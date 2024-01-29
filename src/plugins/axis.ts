import { TimeLinePlugin } from "../types";
import { getNearestPoint } from "../utils";

// Consistency
const labelFontSize = 12;
const axisGap = 4;
const tickLength = 18;
const labelFont = `${labelFontSize}px Arial`;

/**
 * This plugin draws an x-axis on the chart.
 * @param formatLabel A function that converts an time-axis value to a human-readable format
 * @param timeMarks The number of markers to show on the time-axis
 * @param side The side of the graph to render the axis on
 * @returns {TimeLinePlugin}
 */
export const timeAxisPlugin = (
	formatLabel: (x: number) => string = (x) =>
		new Date(x).toLocaleTimeString(),
	timeMarks = 5,
	side: "top" | "bottom" = "bottom",
): TimeLinePlugin => {
	// Calculate fixed x positions for markers
	let markerPositions: number[] = [];
	let calculatedTimeMarks = timeMarks;

	// This is enough space for the labels to breathe comfortably
	let minMarkerGap = 80;

	const labelSpacing = 10;

	return {
		construct: (chart) => {
			chart.padding[side] += 30;
		},
		"calculate-positions": (chart) => {
			// Set font properties
			chart.ctx.font = labelFont;

			minMarkerGap =
				chart.ctx.measureText(formatLabel(Date.now())).width + 20;
			const maxMarkers = Math.floor(chart.width / minMarkerGap);
			calculatedTimeMarks = Math.min(timeMarks, maxMarkers);

			const markerGap = chart.widthInsidePadding / calculatedTimeMarks;
			markerPositions = [];
			for (let i = 0; i < calculatedTimeMarks; i++) {
				markerPositions.push(chart.padding.left + i * markerGap);
			}
		},
		"draw:after": (chart) => {
			const onBottom = side === "bottom";
			// Set font properties
			chart.ctx.font = labelFont;
			chart.ctx.fillStyle = chart.foregroundColour;
			chart.ctx.textAlign = "start";
			chart.ctx.textBaseline = onBottom ? "top" : "bottom";

			for (let i = 0; i < calculatedTimeMarks; i++) {
				const idealX = markerPositions[i];
				const renderY = onBottom
					? chart.heightInsidePadding + chart.padding.top
					: chart.padding.top;

				const point = getNearestPoint(
					chart,
					{ x: idealX, y: renderY },
					"closest-x",
				);
				if (!point) continue;

				const label = formatLabel(point.time);
				const textX = point.renderX + 5;
				const textY = renderY + (onBottom ? axisGap : -axisGap);

				// Credit to Alex Vauiter (https://github.com/Martian8) for this magic
				if (
					i > 0 &&
					chart.computedData[0].renderX >=
						idealX -
							chart.ctx.measureText(label).width -
							labelSpacing
				)
					continue;

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
	};
};

/**
 * This plugin draws a y-axis on the chart.
 * @param formatLabel A function that converts an value-axis value to a human-readable format
 * @param valueMarks The number of markers to show on the value-axis
 * @param side The side of the graph to render the axis on
 * @returns {TimeLinePlugin}
 */
export const valueAxisPlugin = (
	formatLabel: (y: number) => string = (y) => y.toFixed(2),
	valueMarks = 5,
	side: "left" | "right" = "left",
): TimeLinePlugin => ({
	construct: (chart) => {
		chart.padding[side] += 40;
	},
	"draw:after": (chart) => {
		const onLeft = side === "left";
		const { valueOffset, valueMultiplier } =
			chart.getRenderOffsetsAndMultipliers();

		// Set font properties
		chart.ctx.font = labelFont;
		chart.ctx.fillStyle = chart.foregroundColour;
		chart.ctx.textAlign = onLeft ? "right" : "left";
		chart.ctx.textBaseline = "top";
		chart.ctx.fillStyle = chart.foregroundColour;

		const relevantChartContentEdgeX = onLeft
			? chart.padding.left
			: chart.padding.left + chart.widthInsidePadding;

		for (let i = 0; i < valueMarks; i++) {
			const value = (i * chart.heightInsidePadding) / (valueMarks - 1);
			const yRenderPosition = value + chart.padding.top + 1;
			const yDataValue =
				(chart.heightInsidePadding - value) / valueMultiplier -
				valueOffset;

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
