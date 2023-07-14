import { TimeLine, Point, xAxisPlugin, yAxisPlugin } from "../../src";

const data: Point[] = [];
const maxPoints = 300;
const pointGap = 50;
const chart = new TimeLine({
	container: document.getElementById("chart-container") as HTMLElement,
	data,
	maxPoints,
	pointWidth: pointGap,
	xLabel: "Time",
	yLabel: "Random numbers",
	plugins: [
		xAxisPlugin((x) => new Date(x).toLocaleTimeString()),
		yAxisPlugin(),
	],
});

let prev = 0;
setInterval(() => {
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

	chart.recompute();
}, pointGap);

function renderLoop() {
	chart.draw();
	requestAnimationFrame(renderLoop);
}
renderLoop();
