/**
 * Lock delay management
 */

import { DEFAULT_LOCK_DELAY_MS, MAX_LOCK_RESETS } from './constants.js';

export class LockDelayManager {
  constructor(baseLockDelayMs = DEFAULT_LOCK_DELAY_MS, maxResets = MAX_LOCK_RESETS) {
    this.baseDelay = baseLockDelayMs;
    this.maxResets = maxResets;
    this.timer = 0;
    this.resetCount = 0;
    this.isGrounded = false;
  }

  setBaseDelay(delay) {
    this.baseDelay = delay;
  }

  onGroundedStateChange(isGrounded) {
    if (isGrounded && !this.isGrounded) {
      // Just became grounded
      this.isGrounded = true;
      this.timer = this.baseDelay;
    } else if (!isGrounded) {
      // In the air
      this.isGrounded = false;
      this.timer = 0;
    }
  }

  onPieceAction() {
    if (this.isGrounded && this.resetCount < this.maxResets) {
      this.timer = this.baseDelay;
      this.resetCount++;
      return true;
    }
    return false;
  }

  update(deltaMs) {
    if (!this.isGrounded) return false;

    this.timer -= deltaMs;
    return this.timer <= 0;
  }

  reset() {
    this.timer = 0;
    this.resetCount = 0;
    this.isGrounded = false;
  }
}
