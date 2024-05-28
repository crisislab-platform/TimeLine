import type { TimeLine } from "./TimeLine";

export interface TimeLineDataPoint {
	time: number | Date;
	value: number;
}

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
export type TimeLinePlugin = {
	"draw:before"?: TimeLinePluginHook;
	"draw:after"?: TimeLinePluginHook;
	"compute:before"?: TimeLinePluginHook;
	"compute:after"?: TimeLinePluginHook;
	construct?: TimeLinePluginHook;
	pause?: TimeLinePluginHook;
	resume?: TimeLinePluginHook;
	data?: any;
	"calculate-positions"?: TimeLinePluginHook;
	// Allow plugins to define internal functions
} & Record<`plugin_internal:${string}`, Function>;
