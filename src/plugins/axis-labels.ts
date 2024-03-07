import { DOMHost } from "../hosts";
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
): TimeLinePlugin => ({
	data: {
		timeLabelEl: document.createElement("p"),
		valueLabelEl: document.createElement("p"),
		styleTag: document.createElement("style"),
	},
	construct: function (chart) {
		if (chart.host.type !== "browser")
			throw "axisLabelPlugin requires a browser host!";

		if (showTime) {
			chart.padding[ySide] += 20;
		}
		if (showValue) {
			chart.padding[xSide] += 15;
			this.data.styleTag.innerText = `.crisislab-timeline-axis-label {
				font-size: 16px;
				position: absolute;
				user-select: none;
				font-family: Arial, sans-serif;
			}
			.crisislab-timeline-axis-label.crisislab-timeline-time-axis {
				left: 50%;
				transform: translateX(-50%);
				${xSide}: 0px;
				margin-${xSide}: 2px;

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
				margin-${ySide}: 1px;
			}`;
			chart.host.container.appendChild(this.data.styleTag);

			if (showTime) {
				this.data.timeLabelEl.innerText = chart.timeAxisLabel;
				this.data.timeLabelEl.className =
					"crisislab-timeline-axis-label crisislab-timeline-time-axis";
				chart.host.container.appendChild(this.data.timeLabelEl);
			}

			if (showValue) {
				this.data.valueLabelEl.innerText = chart.valueAxisLabel;
				this.data.valueLabelEl.className =
					"crisislab-timeline-axis-label crisislab-timeline-value-axis";
				chart.host.container.appendChild(this.data.valueLabelEl);
			}
		}
	},
});
