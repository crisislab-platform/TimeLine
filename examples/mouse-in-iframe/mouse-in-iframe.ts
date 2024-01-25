import {
	TimeLine,
	TimeLineDataPoint,
	doubleClickCopyPlugin,
	pointerCrosshairPlugin,
	highlightNearestPointPlugin,
	nearestPointInfoPopupPlugin,
} from "../../src/index";

const data: TimeLineDataPoint[] = [];
const timeWindow = 30 * 1000;
const chart = new TimeLine({
	container: document.getElementById("chart-container") as HTMLElement,
	data,
	timeWindow,
	// Note that these aren't used by the chart itself, they're just used by plugins
	timeAxisLabel: "Time",
	valueAxisLabel: "Random numbers",
	plugins: [
		doubleClickCopyPlugin(),
		pointerCrosshairPlugin(),
		highlightNearestPointPlugin(),
		nearestPointInfoPopupPlugin(),
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

	// Call chart.recompute() when you're done updating `data`
	chart.recompute();
}, 50);

// Note that you need to call chart.draw() yourself
function renderLoop() {
	requestAnimationFrame(renderLoop);
	chart.draw();
}
renderLoop();
