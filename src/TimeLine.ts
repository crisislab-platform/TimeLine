import type {
	ComputedTimeLineDataPoint,
	TimeLineDataPoint,
	TimeLinePlugin,
} from "./types";
import { isPointInBox } from "./utils";

interface TimeLineSides {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface TimeLineOptions {
	container: HTMLElement;
	data: TimeLineDataPoint[];
	timeWindow: number;
	valueAxisLabel: string;
	timeAxisLabel: string;
	lineWidth?: number;
	padding?: Partial<TimeLineSides>;
	plugins?: (TimeLinePlugin | null | undefined | false)[];
}

export interface TimeLineHelpfulInfo {
	cursor: {
		x: number;
		y: number;
		chartX: number;
		chartY: number;
		overChart: boolean;
	};
}

// NOTE: Assumes data is sorted by time, with earliest time first in the list
export class TimeLine {
	// Raw data points passed by user
	data: TimeLineDataPoint[];
	// Saved when recompute is called. Only used internally before computedData is done computing
	savedData: TimeLineDataPoint[] = [];
	// Computed when recompute is called. Use this.
	computedData: ComputedTimeLineDataPoint[] = [];

	container: HTMLElement;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	timeWindow: number;
	valueAxisLabel: string;
	timeAxisLabel: string;
	lineWidth = 0.8;
	paused = false;
	padding: TimeLineSides;

	helpfulInfo: TimeLineHelpfulInfo = {
		cursor: {
			x: -1,
			y: -1,
			chartX: -1,
			chartY: -1,
			overChart: false,
		},
	};

	foregroundColour = "black";
	backgroundColour = "white";
	plugins: TimeLinePlugin[];

	constructor(options: TimeLineOptions) {
		this.container = options.container;
		this.data = options.data;
		this.timeWindow = options.timeWindow;
		this.valueAxisLabel = options.valueAxisLabel;
		this.timeAxisLabel = options.timeAxisLabel;
		this.padding = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			...options.padding,
		};

		this.plugins =
			(options.plugins?.filter(
				(plugin) => !!plugin,
			) as TimeLinePlugin[]) || [];

		if (options.lineWidth) this.lineWidth = options.lineWidth;

		// Very important for axis labels
		this.container.style.position = "relative";

		// Setup canvas
		this.canvas = document.createElement("canvas");
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.container.appendChild(this.canvas);
		const context = this.canvas.getContext("2d");
		if (!context) throw "Unable to get canvas context!";
		this.ctx = context;

		// Initial update
		this.updateCanvas();
		// Update canvas on resize

		this.setupPluginUtilities();

		// First update
		this.recompute();

		// Call plugins
		this.handlePluginHooks("construct");
	}

	/**
	 * Called during initialisation to set up event handlers for providing extra useful information for plugins.
	 */
	private setupPluginUtilities() {
		// Save 'this' for use in event handler
		const that = this;

		// Need to make sure that 'this' inside the handler refers to the class
		window.addEventListener("resize", () => {
			that.updateCanvas();
			that.compute();
		});

		// Start tracking mouse position
		const calculateRelativeMousePosition = (
			rect = this.canvas.getBoundingClientRect(),
		) => {
			// Calculate position relative to chart
			if (this.helpfulInfo.cursor.overChart) {
				this.helpfulInfo.cursor.chartX =
					this.helpfulInfo.cursor.x - rect.x;
				this.helpfulInfo.cursor.chartY =
					this.helpfulInfo.cursor.y - rect.y;
			} else {
				this.helpfulInfo.cursor.chartX = -1;
				this.helpfulInfo.cursor.chartY = -1;
			}
		};
		window.addEventListener("mousemove", (event) => {
			this.helpfulInfo.cursor.x = event.clientX;
			this.helpfulInfo.cursor.y = event.clientY;

			// Used by most plugins - save cpu cycles by calculating it once in a central place
			const rect = this.canvas.getBoundingClientRect();
			this.helpfulInfo.cursor.overChart = isPointInBox(
				this.helpfulInfo.cursor.x,
				this.helpfulInfo.cursor.y,
				rect.x,
				rect.y,
				rect.width,
				rect.height,
			);

			calculateRelativeMousePosition(rect);
		});
		document.documentElement.addEventListener("mouseleave", () => {
			this.helpfulInfo.cursor.overChart = false;

			calculateRelativeMousePosition();
		});
	}

	/**
	 * Helper function for handling plugin hooks
	 * @param hook The hook to call
	 */
	private handlePluginHooks(hook: keyof TimeLinePlugin) {
		// Call all plugins with that hook defined
		for (const plugin of this.plugins) {
			plugin?.[hook]?.(this);
		}
	}

	/**
	 * Pauses the chart. New data won't be shown, even if recompute is called,
	 * until the chart is unpaused by calling resume.
	 */
	pause() {
		this.paused = true;
		this.handlePluginHooks("pause");
	}

	/**
	 * Unpauses the chart
	 */
	resume() {
		this.paused = false;
		this.recompute();
		this.handlePluginHooks("resume");
	}

	updateCanvas() {
		// Undo previous scaling
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);

		// Update width and height
		const rect = this.canvas.getBoundingClientRect();
		this.canvas.width = rect.width * window.devicePixelRatio;
		this.canvas.height = rect.height * window.devicePixelRatio;

		// Scale context
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}

	/**
	 * We need to increase the padding by a pixel in each direction so that stuff doesn't go out of frame
	 */
	private get computedPadding() {
		// return this.padding;
		// Save the value of 'this' for use in getter functions
		const that = this;
		return {
			get left() {
				return that.padding.left + 1;
			},
			get right() {
				return that.padding.right + 1;
			},
			get top() {
				return that.padding.top + 1;
			},
			get bottom() {
				return that.padding.bottom + 1;
			},
		};
	}

	get widthInsidePadding() {
		return (
			this.width - this.computedPadding.left - this.computedPadding.right
		);
	}

	get width() {
		return this.canvas.width / window.devicePixelRatio;
	}

	get heightInsidePadding() {
		return (
			this.height - this.computedPadding.bottom - this.computedPadding.top
		);
	}

	get height() {
		return this.canvas.height / window.devicePixelRatio;
	}

	/**
	 * This function does a lot of the heavy lifting for graphing:
	 * it handles everything we need to scale the graph to fit all the data points
	 */
	getRenderOffsetsAndMultipliers(): {
		timeOffset: number;
		timeMultiplier: number;
		valueOffset: number;
		valueMultiplier: number;
		extraTime: number;
	} {
		// Avoid throwing errors dividing by zero
		if (this.savedData.length < 2) {
			// TODO: Remove before release
			console.log("saved data less than 2", this.savedData);
			return {
				timeOffset: 0,
				timeMultiplier: 1,
				valueOffset: 0,
				valueMultiplier: 1,
				extraTime: 0,
			};
		}

		const usedTime = this.savedData.at(-1)!.time - this.savedData[0].time;

		// Left-over space not used up by the current points
		let extraTime = this.timeWindow - usedTime;

		console.log(extraTime);

		// Avoid having a gap at the start
		// This is a horrible evil hack but I give up on fixing the scaling properly
		// if (extraTime < 50) extraTime = 0;

		// Time multiplier scales time window to available pixel width
		const timeMultiplier = this.widthInsidePadding / this.timeWindow;

		// Time offset anchors window at first point time
		const timeOffset = -this.savedData[0].time + extraTime;

		// Y multiplier is simpler - need to find the difference between the minimum and maximum points
		// Note to future self: Always use -Infinity, not Number.MIN_VALUE
		let biggestValue = -Infinity;
		let smallestValue = Infinity;
		for (const point of this.savedData) {
			if (point.value > biggestValue) biggestValue = point.value;
			if (point.value < smallestValue) smallestValue = point.value;
		}

		// Get the maximum gap
		const maxValueGap = biggestValue - smallestValue;

		// Now divide the available pixels by that for the multiplier
		const valueMultiplier = this.heightInsidePadding / maxValueGap;

		// Y offset is very easy - just the inverse of the smallest number
		// since we draw from the top
		const valueOffset = -smallestValue;

		return {
			timeOffset,
			timeMultiplier,
			valueOffset,
			valueMultiplier,
			extraTime,
		};
	}

	/**
	 * Call this to recompute all the data points after the data array has changed.
	 */
	recompute() {
		// Don't change if it's paused
		if (this.paused) return;

		// Don't try and compute if less than 2 points
		if (this.data.length < 2) return;

		// Get the slice of data we're gonna render
		const finalPoint = this.data[this.data.length - 1];
		let startIndex = 0;
		for (let i = this.data.length - 2; i >= 0; i--) {
			const point = this.data[i];
			const timeGap = finalPoint.time - point.time;

			// Take the first point that makes us go outside the chart edges
			if (timeGap > this.timeWindow) {
				startIndex = i;
				break;
			}
		}

		this.savedData = window.structuredClone(this.data).slice(startIndex);

		this.compute();
	}

	/**
	 * We compute the positions for each point separately from rendering them,
	 * to keep render logic clean, and for better performance.
	 */
	private compute() {
		this.handlePluginHooks("compute:before");
		// Draw the lines
		const {
			timeOffset,
			timeMultiplier,
			valueOffset,
			valueMultiplier,
			extraTime,
		} = this.getRenderOffsetsAndMultipliers();

		// If we have data overflowing off the left side
		if (extraTime < 0 && this.savedData.length > 2) {
			// Replace the 'first' point with one that has an average value
			// and is perfectly aligned with the y-axis
			// TODO: Use trig to get the point where the line crosses the axis,
			// instead of just doing an average
			const averageValue =
				(this.savedData[0].value + this.savedData[1].value) / 2;

			const axisAlignedTime = this.savedData[0].time - extraTime;

			const newFirstPoint: TimeLineDataPoint = {
				value: averageValue,
				time: axisAlignedTime,
			};
			this.savedData[0] = newFirstPoint;
		}

		// Clear old data
		this.computedData = [];

		// Compute values for each point
		for (const point of this.savedData) {
			const computedPoint: ComputedTimeLineDataPoint = {
				...point,
				renderX:
					this.computedPadding.left +
					(point.time + timeOffset) * timeMultiplier,
				renderY:
					this.computedPadding.top +
					this.heightInsidePadding -
					(point.value + valueOffset) * valueMultiplier,
			};
			this.computedData.push(computedPoint);
		}
		this.handlePluginHooks("compute:after");
	}

	/**
	 * Call this to draw the graph. The most recently computed data is used.
	 */
	draw() {
		// Don't try and draw if we don't have any data
		if (this.computedData.length < 2) return;

		this.handlePluginHooks("draw:before");
		// Draw in black
		this.ctx.strokeStyle = this.foregroundColour;
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.setLineDash([]);

		// Clear canvas
		this.ctx.fillStyle = this.backgroundColour;
		this.ctx.fillRect(0, 0, this.width, this.height);

		// Draw lines on sides
		this.ctx.strokeRect(
			this.computedPadding.left,
			this.computedPadding.top,
			this.widthInsidePadding,
			this.heightInsidePadding,
		);

		// Begin the path
		this.ctx.beginPath();

		// First data point
		this.ctx.moveTo(
			this.computedData[0].renderX,
			this.computedData[0].renderY,
		);

		// Loop over all points, other than the first one
		for (const point of this.computedData.slice(1)) {
			// Line to moves the 'cursor' to the point we just drew a line to
			this.ctx.lineTo(point.renderX, point.renderY);
		}

		// Draw the path
		this.ctx.stroke();
		this.handlePluginHooks("draw:after");
	}
}
