import { TimeLinePlugin } from "../types";

/**
 * This plugin adds text labels to the X and Y axis.
 * @param showTime Weather or not to add the x-axis label
 * @param showValue Weather or not to add the y-axis label
 * @returns {TimeLinePlugin}
 */
export const axisLabelPlugin = (
	showTime = true,
	showValue = true,
): TimeLinePlugin => ({
	data: {
		timeLabelEl: document.createElement("p"),
		valueLabelEl: document.createElement("p"),
		styleTag: document.createElement("style"),
	},
	construct: function (chart) {
		if (showTime) {
			chart.padding.left += 20;
		}
		if (showValue) {
			chart.padding.bottom += 10;
		}

		this.data.styleTag.innerText = `.crisislab-timeline-axis-label {
				font-size: 16px;
				position: absolute;
				user-select: none;
				font-family: Arial, sans-serif;
			}
			.crisislab-timeline-axis-label.crisislab-timeline-time-axis {
				left: 50%;
				transform: translateX(-50%);
				bottom: 0px;
				margin-bottom: 2px;

			}

			.crisislab-timeline-axis-label.crisislab-timeline-value-axis {
                left: 0px;
				top: 50%;
				writing-mode: vertical-rl;
				transform: rotate(180deg) translateY(50%);
				margin-left: 1px;
			}`;
		chart.container.appendChild(this.data.styleTag);

		if (showTime) {
			this.data.timeLabelEl.innerText = chart.timeAxisLabel;
			this.data.timeLabelEl.className =
				"crisislab-timeline-axis-label crisislab-timeline-time-axis";
			chart.container.appendChild(this.data.timeLabelEl);
		}

		if (showValue) {
			this.data.valueLabelEl.innerText = chart.valueAxisLabel;
			this.data.valueLabelEl.className =
				"crisislab-timeline-axis-label crisislab-timeline-value-axis";
			chart.container.appendChild(this.data.valueLabelEl);
		}
	},
});
