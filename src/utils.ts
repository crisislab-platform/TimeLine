import type { TimeLine } from "./TimeLine";
import type {
	ComputedTimeLineDataPoint,
	TimeLineDataPoint,
	PlainPoint,
	DistanceMethod,
} from "./types";

export function plainPointToTimeLineDataPoint(
	plain: PlainPoint,
): TimeLineDataPoint {
	return { time: plain.x, value: plain.y };
}

export function timeLineDataPointToPlainPoint(
	timeLinePoint: TimeLineDataPoint,
): PlainPoint {
	return { x: timeLinePoint.time, y: timeLinePoint.value };
}

export function distanceBetweenTwoPoints(a: PlainPoint, b: PlainPoint): number {
	// Right-angled triangles are magic. Thanks Ancient greeks!
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function getNearestPoint(
	chart: TimeLine,
	point: PlainPoint,
	method: DistanceMethod = "pythagoras",
): ComputedTimeLineDataPoint | null {
	// Sanity check
	if (chart.computedData.length < 1) return null;

	// Find closest point
	let closestDataPoint: ComputedTimeLineDataPoint | null = null;
	let closestDistance = Number.MAX_VALUE;
	for (const chartPoint of chart.computedData) {
		let distance: number;
		if (method === "closest-x") {
			distance = distanceBetweenTwoPoints(
				{ x: chartPoint.renderX, y: point.y },
				point,
			);
		} else if (method === "closest-y") {
			distance = distanceBetweenTwoPoints(
				{ x: point.x, y: chartPoint.renderY },
				point,
			);
		} else {
			// Pythagoras
			distance = distanceBetweenTwoPoints(
				{ x: chartPoint.renderX, y: chartPoint.renderY },
				point,
			);
		}

		if (distance < closestDistance) {
			closestDistance = distance;
			closestDataPoint = chartPoint;
		}
	}

	return closestDataPoint;
}

export function isPointInBox(
	px: number,
	py: number,
	x: number,
	y: number,
	w: number,
	h: number,
): boolean {
	return x <= px && px <= x + w && y <= py && py <= y + h;
}
