import { TimeLinePlugin } from "../types";

/**
 * This plugin adds text labels to the X and Y axis.
 * @param showX Weather or not to add the x-axis label
 * @param showY Weather or not to add the y-axis label
 * @param xSide The side to position the x-axis label
 * @param ySide The side to position the y-axis label
 * @returns {TimeLinePlugin}
 */
export const axisLabelPlugin = (
	showX = true,
	showY = true,
	xSide: "top" | "bottom" = "bottom",
	ySide: "left" | "right" = "left",
): TimeLinePlugin => ({
	data: {
		xLabelEl: document.createElement("p"),
		yLabelEl: document.createElement("p"),
		styleTag: document.createElement("style"),
	},
	construct: function (chart) {
		if (showY) {
			chart.padding[ySide] += 20;
		}
		if (showX) {
			chart.padding[xSide] += 10;
		}

		this.data.styleTag.innerText = `.crisislab-timeline-axis-label {
				font-size: 16px;
				position: absolute;
				user-select: none;
				font-family: Arial, sans-serif;
			}
			.crisislab-timeline-axis-label.crisislab-timeline-x-axis {
				left: 50%;
				transform: translateX(-50%);
				${xSide}: 0px;
				margin-${xSide}: 2px;

			}

			.crisislab-timeline-axis-label.crisislab-timeline-y-axis {
                ${ySide}: 0px;
				top: 50%;
				writing-mode: vertical-lr;
				transform: ${
					ySide === "left"
						? "rotate(180deg) translateY(50%)"
						: "translateY(-50%)"
				};
				margin-${ySide}: 1px;
			}`;
		chart.container.appendChild(this.data.styleTag);

		if (showX) {
			this.data.xLabelEl.innerText = chart.xLabel;
			this.data.xLabelEl.className =
				"crisislab-timeline-axis-label crisislab-timeline-x-axis";
			chart.container.appendChild(this.data.xLabelEl);
		}

		if (showY) {
			this.data.yLabelEl.innerText = chart.yLabel;
			this.data.yLabelEl.className =
				"crisislab-timeline-axis-label crisislab-timeline-y-axis";
			chart.container.appendChild(this.data.yLabelEl);
		}
	},
});
