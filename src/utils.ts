import type { TimeLine } from "./TimeLine";
import type { ComputedTimeLineDataPoint, Point } from "./types";

export function distanceBetweenTwoPoints(a: Point, b: Point): number {
	// Right-angled triangles are magic. Thanks Ancient greeks!
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function getNearestPoint(
	chart: TimeLine,
	point: Point,
): ComputedTimeLineDataPoint | null {
	// Sanity check
	if (chart.computedData.length < 1) return null;

	// Find closest point
	let closestDataPoint: ComputedTimeLineDataPoint | null = null;
	let closestDistance = Number.MAX_VALUE;
	for (const chartPoint of chart.computedData) {
		const distance = distanceBetweenTwoPoints(
			{ x: chartPoint.renderX, y: chartPoint.renderY },
			point,
		);

		if (distance < closestDistance) {
			closestDistance = distance;
			closestDataPoint = chartPoint;
		}
	}

	return closestDataPoint;
}
