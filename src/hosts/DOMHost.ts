import { TimeLine } from "../TimeLine";
import { TimeLineHost } from "../types";
import { isPointInBox } from "../utils";

export class DOMHost implements TimeLineHost {
	canvas: HTMLCanvasElement;
	container: HTMLElement;
	ctx: CanvasRenderingContext2D;

	type = "browser" as const;

	cursorInfo = {
		x: -1,
		y: -1,
		chartX: -1,
		chartY: -1,
		overChart: false,
	};

	chart: TimeLine | null = null;

	constructor(container: HTMLElement) {
		if (!window || !window.devicePixelRatio || !document || !container)
			throw "DOMHost needs a browser-like environment!";

		this.container = container;
		// Very important for axis labels
		this.container.style.position = "relative";

		this.canvas = document.createElement("canvas");
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";

		this.container.appendChild(this.canvas);

		const context = this.canvas.getContext("2d");
		if (!context) throw "Unable to get canvas context!";
		this.ctx = context;
	}

	setup(chart: TimeLine) {
		this.chart = chart;
		this.updateCanvas();

		if (!this.chart) return;

		// Need to make sure that 'this' inside the handler refers to the class
		window.addEventListener("resize", () => {
			if (!this.chart) return;

			this.updateCanvas();
			this.chart._compute();
			this.chart._handlePluginHooks("calculate-positions");
		});
		// Also call on setup for first thing
		this.chart._handlePluginHooks("calculate-positions");

		// Start tracking mouse position
		const calculateRelativeMousePosition = (
			rect = this.canvas.getBoundingClientRect(),
		) => {
			// Calculate position relative to chart
			if (this.cursorInfo.overChart) {
				this.cursorInfo.chartX = this.cursorInfo.x - rect.x;
				this.cursorInfo.chartY = this.cursorInfo.y - rect.y;
			} else {
				this.cursorInfo.chartX = -1;
				this.cursorInfo.chartY = -1;
			}
		};
		window.addEventListener("mousemove", (event) => {
			this.cursorInfo.x = event.clientX;
			this.cursorInfo.y = event.clientY;

			// Used by most plugins - save cpu cycles by calculating it once in a central place
			const rect = this.canvas.getBoundingClientRect();
			this.cursorInfo.overChart = isPointInBox(
				this.cursorInfo.x,
				this.cursorInfo.y,
				rect.x,
				rect.y,
				rect.width,
				rect.height,
			);

			calculateRelativeMousePosition(rect);
		});
		document.documentElement.addEventListener("mouseleave", () => {
			this.cursorInfo.overChart = false;

			calculateRelativeMousePosition();
		});
	}

	updateCanvas() {
		// Undo previous scaling
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);

		// Update width and height
		const rect = this.canvas.getBoundingClientRect();
		this.width = rect.width * window.devicePixelRatio;
		this.height = rect.height * window.devicePixelRatio;

		// Scale context
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}

	get width(): number {
		return this.DOMWidth / window.devicePixelRatio;
	}

	get DOMWidth(): number {
		return this.canvas.width;
	}

	set width(value: number) {
		this.canvas.width = value;
	}

	get height(): number {
		return this.DOMHeight / window.devicePixelRatio;
	}

	get DOMHeight(): number {
		return this.canvas.width;
	}

	set height(value: number) {
		this.canvas.height = value;
	}
}
