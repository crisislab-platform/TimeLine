import type { TimeLine } from "./TimeLine";

export interface TimeLineDataPoint {
	time: number | Date;
	value: number;
}

export type TimeLineHost = {
	width: number;
	height: number;
	readonly ctx: CanvasRenderingContext2D;
	chart: TimeLine | null;
	setup(chart: TimeLine): void;
	readonly type: "browser" | "server";
} & {
	type: "browser";
	container: HTMLElement;
	canvas: HTMLCanvasElement;
	cursorInfo: {
		x: number;
		y: number;
		chartX: number;
		chartY: number;
		overChart: boolean;
	};
};

export interface TimeLineSavedDataPoint {
	time: number;
	value: number;
}

export interface PlainPoint {
	x: number;
	y: number;
}

export interface ComputedTimeLineDataPoint extends TimeLineDataPoint {
	time: number;
	value: number;
	renderX: number;
	renderY: number;
}

export type DistanceMethod = "pythagoras" | "closest-x" | "closest-y";

type TimeLinePluginHook = (chart: TimeLine) => void;
export interface TimeLinePlugin {
	"draw:before"?: TimeLinePluginHook;
	"draw:after"?: TimeLinePluginHook;
	"compute:before"?: TimeLinePluginHook;
	"compute:after"?: TimeLinePluginHook;
	construct?: TimeLinePluginHook;
	pause?: TimeLinePluginHook;
	resume?: TimeLinePluginHook;
	data?: any;
	"calculate-positions"?: TimeLinePluginHook;
}
