/**
 * Touch gesture and control processing
 */

import {
  CELL_DRAG_THRESHOLD,
  TAP_MAX_DURATION_MS,
  TAP_MAX_DISTANCE,
  SWIPE_DOWN_VELOCITY_THRESHOLD,
  SWIPE_DOWN_DISTANCE_THRESHOLD,
} from './constants.js';

export const SENSITIVITY_THRESHOLDS = {
  low: 32,
  normal: 26,
  high: 20,
};

export class GestureProcessor {
  constructor({
    onMoveLeft,
    onMoveRight,
    onRotateClockwise,
    onRotateCounterClockwise,
    onSoftDropStart,
    onSoftDropEnd,
    onHardDrop,
    sensitivity = 'normal',
  }) {
    this.onMoveLeft = onMoveLeft;
    this.onMoveRight = onMoveRight;
    this.onRotateClockwise = onRotateClockwise;
    this.onRotateCounterClockwise = onRotateCounterClockwise;
    this.onSoftDropStart = onSoftDropStart;
    this.onSoftDropEnd = onSoftDropEnd;
    this.onHardDrop = onHardDrop;

    this.dragThreshold = SENSITIVITY_THRESHOLDS[sensitivity] || CELL_DRAG_THRESHOLD;

    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.accumulatedDeltaX = 0;
    this.accumulatedDeltaY = 0;
    this.isSoftDropping = false;
    this.hasMoved = false;
  }

  setSensitivity(sensitivity) {
    this.dragThreshold = SENSITIVITY_THRESHOLDS[sensitivity] || CELL_DRAG_THRESHOLD;
  }

  onTouchStart(e) {
    const touch = e.nativeEvent;
    this.startX = touch.pageX || touch.locationX;
    this.startY = touch.pageY || touch.locationY;
    this.startTime = Date.now();
    this.accumulatedDeltaX = 0;
    this.accumulatedDeltaY = 0;
    this.isSoftDropping = false;
    this.hasMoved = false;
  }

  onTouchMove(e) {
    const touch = e.nativeEvent;
    const currentX = touch.pageX || touch.locationX;
    const currentY = touch.pageY || touch.locationY;

    const dx = currentX - this.startX;
    const dy = currentY - this.startY;

    const frameDx = dx - this.accumulatedDeltaX;
    const frameDy = dy - this.accumulatedDeltaY;

    this.accumulatedDeltaX = dx;
    this.accumulatedDeltaY = dy;

    // Horizontal step detection
    if (Math.abs(this.accumulatedDeltaX) >= this.dragThreshold) {
      this.hasMoved = true;
      const steps = Math.trunc(this.accumulatedDeltaX / this.dragThreshold);
      if (steps > 0) {
        for (let i = 0; i < steps; i++) {
          this.onMoveRight && this.onMoveRight();
        }
      } else if (steps < 0) {
        for (let i = 0; i < Math.abs(steps); i++) {
          this.onMoveLeft && this.onMoveLeft();
        }
      }
      this.accumulatedDeltaX %= this.dragThreshold;
    }

    // Soft drop gesture: dragging downward
    if (this.accumulatedDeltaY > 30 && !this.isSoftDropping) {
      this.isSoftDropping = true;
      this.hasMoved = true;
      this.onSoftDropStart && this.onSoftDropStart();
    }
  }

  onTouchEnd(e) {
    const touch = e.nativeEvent;
    const endX = touch.pageX || touch.locationX;
    const endY = touch.pageY || touch.locationY;
    const duration = Date.now() - this.startTime;

    const totalDx = endX - this.startX;
    const totalDy = endY - this.startY;
    const distance = Math.sqrt(totalDx * totalDx + totalDy * totalDy);

    if (this.isSoftDropping) {
      this.isSoftDropping = false;
      this.onSoftDropEnd && this.onSoftDropEnd();
    }

    // Fast flick down or hard drop swipe
    const velocityY = totalDy / Math.max(1, duration);
    if (
      totalDy > SWIPE_DOWN_DISTANCE_THRESHOLD &&
      velocityY > SWIPE_DOWN_VELOCITY_THRESHOLD
    ) {
      this.onHardDrop && this.onHardDrop();
      return;
    }

    // Tap detection: short duration and minimal movement -> Rotate Clockwise
    if (duration < TAP_MAX_DURATION_MS && distance < TAP_MAX_DISTANCE && !this.hasMoved) {
      this.onRotateClockwise && this.onRotateClockwise();
    }
  }

  reset() {
    if (this.isSoftDropping) {
      this.isSoftDropping = false;
      this.onSoftDropEnd && this.onSoftDropEnd();
    }
    this.startX = 0;
    this.startY = 0;
    this.accumulatedDeltaX = 0;
    this.accumulatedDeltaY = 0;
    this.hasMoved = false;
  }
}
