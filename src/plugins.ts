import { TimeLinePlugin } from "./types";

// Consistency
const labelFontSize = 12;
const axisPadding = 4;
const tickLength = 18;
const labelFont = `${labelFontSize}px Arial`;

export const xAxisPlugin = (
	formatLabel: (x: number) => string = (x) => x + "",
	xMarks = 5,
): TimeLinePlugin => ({
	construct: (chart) => {
		chart.bottomPadding = 30;
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

			const label = formatLabel(point.x);
			const textX = point.renderX + 5;
			const textY = chart.heightWithPadding + axisPadding;

			// Marker
			chart.ctx.beginPath();
			chart.ctx.moveTo(point.renderX, chart.heightWithPadding);
			chart.ctx.lineTo(
				point.renderX,
				chart.heightWithPadding + tickLength,
			);
			chart.ctx.stroke();

			// Label
			chart.ctx.fillText(label, textX, textY);
		}
	},
});

export const yAxisPlugin = (
	formatLabel: (y: number) => string = (y) => y + "",
	yMarks = 5,
): TimeLinePlugin => ({
	construct: (chart) => {
		chart.leftPadding = 60;
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
			const yValue = (i * chart.heightWithPadding) / (yMarks - 1);
			const yDataValue =
				(chart.heightWithPadding - yValue) / yMultiplier - yOffset;

			const textX = chart.leftPadding - axisPadding;
			const textY = yValue + axisPadding; // Move down so it doesn't overlap the line
			const label = formatLabel(yDataValue);

			//Marker
			chart.ctx.beginPath();
			chart.ctx.moveTo(chart.leftPadding - tickLength, yValue);
			chart.ctx.lineTo(chart.leftPadding, yValue);
			chart.ctx.stroke();

			// Label
			chart.ctx.fillText(label, textX, textY);
		}
	},
});
