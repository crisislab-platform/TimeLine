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
const timeWindow = 5 * 1000;
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

window.data = data;
window.chart = chart;
let prev = 0;
function addPoint() {
	setTimeout(addPoint, Math.random() * 100);

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
}
addPoint();
