# TimeLine

[GitHub](https://github.com/crisislab-platform/TimeLine) | [NPM](https://www.npmjs.com/package/@crisislab/timeline)

TimeLine is the dependency-free time-series web realtime graphing library developed using Typescript in-house at [CRISiSLab](https://www.crisislab.org.nz/).

We use TimeLine in production [here](https://shakemap.crisislab.org.nz/).

However, this library is designed for one use-case: rendering live seismograph data. It might not be ideal for your use-case. You should also check out [huww98/TimeChart](https://github.com/huww98/TimeChart).

## Usage

### Installation

```
npm i @crisislab/timeline
```

Typescript definitions are included in the package.

### Important notes!

-   `data` should be sorted by x-value, with smallest values first. If you always add new data onto the end, this shouldn't be a problem.
-   Make sure that the `data` array you give to the chart isn't longer than `maxLength`
-   Call `chart.recompute()` whenever you've updated the data array. You can also use this to batch changes by waiting until you're done modifying `data` before recomputing.
-   The chart won't compute or draw anything if there are less than two points.

### Examples

<details>
<summary>Basic live data</summary>

```ts
import {
	TimeLine,
	TimeLineDataPoint,
	timeAxisPlugin,
	axisLabelPlugin,
} from "@crisislab/timeline";

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
		// By default, the chart doesn't draw an x or y axis.
		// You can use these built-in plugins though.
		timeAxisPlugin((x) => new Date(x).toLocaleTimeString()),
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

	// Call chart.recompute() when you're done updating `data`
	chart.recompute();
}, 50);
```

</details>

More examples in the [examples folder](./examples/).

### Plugins

There are several plugins included:

-   `timeAxisPlugin`: Adds an x-axis (but not an axis label)
-   `valueAxisPlugin`: Adds an y-axis (but not an axis label)
-   `axisLabelPlugin`: Adds axis labels for the X and Y axis
-   `pointerCrosshairPlugin`: Adds a crosshair that follows the mouse
-   `highlightNearestPointPlugin`: Draws a marker on the nearest point to the mouse
-   `doubleClickCopyPlugin`: Makes double clicking on the canvas copy the values of the nearest point in tsv (csv) format to the clipboard

## Credit

This project was inspired by [TimeChart](https://github.com/huww98/TimeChart) by [huww98](https://github.com/huww98). We were originally using huww98's library, but found that webGL was excessive for our needs, and created too many problems to justify continuing to use it. Our library's API design is inspired by huww98's library, and the visuals are similar, but under the hood it's completly different. Our library uses the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) instead of [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) for rendering, so it won't be as performant for huge amounts of data.
