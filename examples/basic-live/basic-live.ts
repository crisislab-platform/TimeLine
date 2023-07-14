import { TimeLine, Point, xAxisPlugin, yAxisPlugin } from "../../src";

const data: Point[] = [];
const maxPoints = 300;
const pointGap = 50;
const chart = new TimeLine({
	container: document.getElementById("chart-container") as HTMLElement,
	data,
	maxPoints,
	pointGap,
	// Note that these aren't used by the chart itself, they're just used by plugins
	xLabel: "Time",
	yLabel: "Random numbers",
	plugins: [
		// By default, the chart doesn't draw an x or y axis.
		// You can use these built-in plugins though.
		xAxisPlugin((x) => new Date(x).toLocaleTimeString()),
		yAxisPlugin(),
		// Also these plugins don't label the axis they generate.
		// You have to do that yourself in HTML.
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

	// Call chart.recompute() when you're done updating `data`
	chart.recompute();
}, pointGap);

// Note that you need to call chart.draw() yourself
function renderLoop() {
	chart.draw();
	requestAnimationFrame(renderLoop);
}
renderLoop();
