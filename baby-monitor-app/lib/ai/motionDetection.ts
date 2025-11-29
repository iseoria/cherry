// src/lib/ai/motionDetection.ts

export type Keypoint = [number, number, number?];

export type MotionResult = {
  turns: number;
  movement: number;
  isTurn: boolean;
};

let previousKeypoints: Keypoint[] | null = null;
let turnCount = 0;

function calculateMotion(current: Keypoint[], previous: Keypoint[]): number {
  if (!current || !previous) return 0;

  let totalChange = 0;
  let count = 0;

  for (let i = 0; i < current.length; i++) {
    const kpCurrent = current[i];
    const kpPrev = previous[i];
    if (kpCurrent && kpPrev) {
      const dx = kpCurrent[0] - kpPrev[0];
      const dy = kpCurrent[1] - kpPrev[1];
      totalChange += Math.sqrt(dx * dx + dy * dy);
      count++;
    }
  }

  return count > 0 ? totalChange / count : 0;
}

/**
 * 현재 프레임 keypoints로 뒤척임 감지
 * - threshold는 기존처럼 15 기본값
 */
export function detectMotionFromKeypoints(
  currentKeypoints: Keypoint[] | null,
  threshold = 15
): MotionResult {
  if (!currentKeypoints || currentKeypoints.length === 0) {
    return {
      turns: turnCount,
      movement: 0,
      isTurn: false,
    };
  }

  let movement = 0;
  let isTurn = false;

  if (previousKeypoints) {
    movement = calculateMotion(currentKeypoints, previousKeypoints);
    if (movement > threshold) {
      turnCount++;
      isTurn = true;
      console.log(`🌀 Motion detected! Total turns: ${turnCount}`);
    }
  }

  previousKeypoints = currentKeypoints;

  return {
    turns: turnCount,
    movement,
    isTurn,
  };
}

export function resetMotionState() {
  previousKeypoints = null;
  turnCount = 0;
}
