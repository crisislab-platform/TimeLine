import { TimeLinePlugin } from "../types";
import { getNearestPoint, isPointInBox } from "../utils";

/**
 * This plugin adds text labels to the X and Y axis.
 * @returns {TimeLinePlugin}
 */
export const axisLabelPlugin = (): TimeLinePlugin => ({
	data: {
		xLabelEl: document.createElement("p"),
		yLabelEl: document.createElement("p"),
		styleTag: document.createElement("style"),
	},
	construct: function (chart) {
		chart.leftPadding += 30;

		this.data.styleTag.innerText = `
        .crisislab-timeline-axis-label {
				font-size: 12px;
				position: absolute;
				user-select: none;
			}
			.crisislab-timeline-axis-label.crisislab-timeline-x-axis {
				left: 50%;
				transform: translateX(-50%);
				bottom: 0px;
			}

			.crisislab-timeline-axis-label.crisislab-timeline-y-axis {
                left: 0px;
				top: 50%;
				writing-mode: vertical-rl;
				transform: rotate(180deg) translateY(50%);
			}`;
		chart.container.appendChild(this.data.styleTag);

		this.data.xLabelEl.innerText = chart.xLabel;
		this.data.xLabelEl.className =
			"crisislab-timeline-axis-label crisislab-timeline-x-axis";
		chart.container.appendChild(this.data.xLabelEl);

		this.data.yLabelEl.innerText = chart.yLabel;
		this.data.yLabelEl.className =
			"crisislab-timeline-axis-label crisislab-timeline-y-axis";
		chart.container.appendChild(this.data.yLabelEl);
	},
});
