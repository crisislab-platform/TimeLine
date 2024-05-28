import { TimeLinePlugin } from "../types";

/**
 * This plugin adds text labels to the X and Y axis.
 * @returns {TimeLinePlugin}
 * @param showTime Weather or not to add the x-axis label
 * @param showValue Weather or not to add the y-axis label
 * @param xSide The side to position the x-axis label
 * @param ySide The side to position the y-axis label
 * @returns {TimeLinePlugin}
 */
export const axisLabelPlugin = (
	showTime = true,
	showValue = true,
	xSide: "top" | "bottom" = "bottom",
	ySide: "left" | "right" = "left",
): TimeLinePlugin => {
	const timePadding = 8;
	const valuePadding = 4;

	const characterHeight = 18;
	const fontSize = 16;

	return {
		data: {
			timeLabelEl: document.createElement("p"),
			valueLabelEl: document.createElement("p"),
			styleTag: document.createElement("style"),
		},
		construct: function (chart) {
			this.data.styleTag.innerText = `.crisislab-timeline-axis-label {
				font-size: ${fontSize}px;
				position: absolute;
				user-select: none;
				font-family: monospace;
				margin:0;
				p:0;
				box-sizing:border-box;
			}
			.crisislab-timeline-axis-label.crisislab-timeline-time-axis {
				left: 50%;
				transform: translateX(-50%);
				${xSide}: 0px;
				margin-${xSide}: ${timePadding}px;
			}

			.crisislab-timeline-axis-label.crisislab-timeline-value-axis {
        ${ySide}: 0px;
				top: 50%;
				writing-mode: vertical-lr;
				transform: ${
					ySide === "left"
						? "rotate(180deg) translateY(50%)"
						: "translateY(-50%)"
				};
				margin-${ySide}: ${valuePadding}px;
			}`;
			chart.container.appendChild(this.data.styleTag);

			if (showTime) {
				chart.padding[xSide] += characterHeight + valuePadding;

				this.data.timeLabelEl.innerText = chart.timeAxisLabel;
				this.data.timeLabelEl.className =
					"crisislab-timeline-axis-label crisislab-timeline-time-axis";
				chart.container.appendChild(this.data.timeLabelEl);
			}

			if (showValue) {
				chart.padding[ySide] += characterHeight + timePadding;

				this.data.valueLabelEl.innerText = chart.valueAxisLabel;
				this.data.valueLabelEl.className =
					"crisislab-timeline-axis-label crisislab-timeline-value-axis";
				chart.container.appendChild(this.data.valueLabelEl);
			}
		},
	};
};
