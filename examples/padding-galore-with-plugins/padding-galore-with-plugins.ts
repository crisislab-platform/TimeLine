// @ts-nocheck

import {
	TimeLine,
	TimeLineDataPoint,
	timeAxisPlugin,
	valueAxisPlugin,
	doubleClickCopyPlugin,
	highlightNearestPointPlugin,
	nearestPointInfoPopupPlugin,
	pointerCrosshairPlugin,
	axisLabelPlugin,
} from "../../src/index";

const data: TimeLineDataPoint[] = [];
const timeWindow = 30 * 1000;
const chart = new TimeLine({
	padding: {
		left: 12,
		right: 30,
		top: 50,
		bottom: 8,
	},
	container: document.getElementById("chart-container") as HTMLElement,
	data,
	timeWindow,
	// Note that these aren't used by the chart itself, they're just used by plugins
	timeAxisLabel: "Time",
	valueAxisLabel: "Random numbers",
	plugins: [
		timeAxisPlugin(),
		valueAxisPlugin(),
		doubleClickCopyPlugin(),
		highlightNearestPointPlugin(),
		nearestPointInfoPopupPlugin(),
		pointerCrosshairPlugin(),
		axisLabelPlugin(),
	],
});

window.chart = chart;
window.data = data;

let prev = 0;
setInterval(() => {
	const y =
		prev + Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? -1 : 1);
	prev = y;
	data.push({
		time: Date.now(),
		value: y,
	});

	// Avoid filling up ram too much
	if (data.length > 10000) {
		data.shift();
	}

	// Call chart.recompute() when you're done updating `data`
	chart.recompute();
}, 50);
