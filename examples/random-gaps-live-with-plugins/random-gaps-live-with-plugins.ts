import {
	TimeLine,
	Point,
	xAxisPlugin,
	yAxisPlugin,
	doubleClickCopyPlugin,
	highlightNearestPointPlugin,
	nearestPointInfoPopupPlugin,
	pointerCrosshairPlugin,
	axisLabelPlugin,
} from "../../src";

const data: Point[] = [];
const maxPoints = 300;
const chart = new TimeLine({
	container: document.getElementById("chart-container") as HTMLElement,
	data,
	maxPoints,
	xLabel: "Time",
	yLabel: "Random numbers",
	plugins: [
		xAxisPlugin((x) => new Date(x).toLocaleTimeString()),
		yAxisPlugin(),
		doubleClickCopyPlugin(),
		highlightNearestPointPlugin(),
		nearestPointInfoPopupPlugin(),
		pointerCrosshairPlugin(),
		axisLabelPlugin(),
	],
});

let prev = 0;
function addPoint() {
	setTimeout(addPoint, Math.random() * 50);

	const y =
		prev + Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? -1 : 1);
	prev = y;
	data.push({
		x: Date.now(),
		y,
	});
	// This is very important!
	// You can't have more points in the data array
	// than chart.maxPoints, or you'll have weird
	// rendering issues.
	while (data.length > maxPoints) {
		data.shift();
	}

	// Call chart.recompute() when you're done updating `data`
	chart.recompute();
}
addPoint();
