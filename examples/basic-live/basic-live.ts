import {
	TimeLine,
	timeAxisPlugin,
	axisLabelPlugin,
	TimeLineDataPoint,
} from "../../src/index";

const timeWindow = 30 * 1000; // 30 seconds

const data: TimeLineDataPoint[] = [];
const chart = new TimeLine({
	container: document.getElementById("chart-container") as HTMLElement,
	data,
	timeWindow,
	// Note that these aren't used by the chart itself, they're just used by plugins
	timeAxisLabel: "Time",
	valueAxisLabel: "Random numbers",
	plugins: [
		// By default, the chart doesn't draw an time or y axis.
		// You can use these built-in plugins though.
		timeAxisPlugin((time) => new Date(time).toLocaleTimeString()),
		axisLabelPlugin(),
	],
});

// @ts-ignore
window.chart = chart;

let prev = 0;
setInterval(() => {
	const value =
		prev + Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? -1 : 1);
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
