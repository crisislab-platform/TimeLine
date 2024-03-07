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
	container: document.getElementById("chart-container")!,
	data,
	timeWindow,
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
