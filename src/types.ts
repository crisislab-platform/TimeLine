import type { TimeLine } from "./TimeLine";

export interface Point {
	y: number;
	x: number;
}

export type TimeLineDataPoint = Point;

export interface ComputedTimeLineDataPoint extends TimeLineDataPoint {
	y: number;
	x: number;
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
}
