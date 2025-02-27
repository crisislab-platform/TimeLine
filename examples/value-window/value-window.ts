// @ts-nocheck

import {
	TimeLine,
	timeAxisPlugin,
	axisLabelPlugin,
	TimeLineDataPoint,
} from "../../src/index";

const overflowBehaviourEl = document.getElementById("overflow-behaviour")!;
const enableValueWindowEl = document.getElementById("enable-value-window")!;

const timeWindow = 30 * 1000; // 30 seconds
const data: TimeLineDataPoint[] = [];
const chart = new TimeLine({
	container: document.getElementById("chart-container") as HTMLElement,
	data,
	timeWindow,
	// Setting this disables the view from scaling up data to fill the
	// whole viewport
	valueWindow: {
		// The window is set to view between these numbers,
		min: -5,
		max: 5,
		// "clip" makes overflowing values disappear offscreen
		// "scale" will let overflowing values stretch the view window,
		//  but won't shrink back to smaller than the min and max values
		overflowBehaviour: overflowBehaviourEl.value,
	},
	// Note that these aren't used by the chart itself, they're just used by plugins
	timeAxisLabel: "Time",
	valueAxisLabel: "Random numbers",
	plugins: [
		// By default, the chart doesn't draw an time or y axis.
		// You can use these built-in plugins though.
		axisLabelPlugin(),
	],
});

overflowBehaviourEl!.onchange = () => {
	chart.valueWindow!.overflowBehaviour = overflowBehaviourEl.value;
};
enableValueWindowEl.onchange = () => {
	if (enableValueWindowEl.checked) {
		chart.valueWindow = window.tempValueWindow;
		overflowBehaviourEl.toggleAttribute("disabled", false);
	} else {
		window.tempValueWindow = chart.valueWindow;
		chart.valueWindow = undefined;
		overflowBehaviourEl.toggleAttribute("disabled", true);
	}
};

window.chart = chart;
window.data = data;

let prev = 0;
setInterval(() => {
	const value = prev + Math.random() * (Math.random() > 0.5 ? -1 : 1);
	prev = value;
	data.push({
		time: Date.now(),
		value,
	});

	// Avoid filling up ram too much
	if (data.length > 10000) {
		data.shift();
	}

	// Call chart.recompute() when you're done updating `data`
	chart.recompute();
}, 100);
