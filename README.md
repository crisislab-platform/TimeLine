# TimeLine

TimeLine is the dependency-free Typescript time-series web graphing library developed in-house at [CRISiSLab](https://www.crisislab.org.nz/).

We use TimeLine in production [here](https://shakemap.crisislab.org.nz/).

## Usage

### Installation

```
npm i @crisislab/timeline
```

Typescript definitions are included in the package.

### Examples

<details>
<summary>Basic live data</summary>
```ts
import { TimeLine, Point, xAxisPlugin, yAxisPlugin } from "../../src";

const data: Point[] = [];
const maxPoints = 500;
const pointGap = 10;
const chart = new TimeLine({
container: document.getElementById("chart-container") as HTMLElement,
data,
maxPoints,
pointWidth: pointGap,
xLabel: "Time",
yLabel: "Random numbers",
plugins: [xAxisPlugin(), yAxisPlugin()],
});

let prev = 0;
setInterval(() => {
const y =
prev + Math.floor(Math.random() _ 10) _ (Math.random() > 0.5 ? -1 : 1);
prev = y;
data.push({
x: Date.now(),
y,
});
// This is very important!
// You can't have more points in the data array
// than chart.maxPoints, or you'll have weird
// rendering issues.
if (data.length > maxPoints) {
data.shift();
}
chart.recompute();
}, pointGap);

function renderLoop() {
chart.draw();
requestAnimationFrame(renderLoop);
}
renderLoop();

```
</details>

## Credit

This project was inspired by [TimeChart](https://github.com/huww98/TimeChart) by [huww98](https://github.com/huww98). We were originally using huww98's library, but found that webGL was excessive for our needs, and created too many problems to justify continuing to use it. Our library's API design is inspired by huww98's library, and the visuals are similar, but under the hood it's completly different. Our library uses the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) instead of [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) for rendering, so it won't be as performant for huge amounts of data.
```
