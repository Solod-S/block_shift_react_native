/**
 * 7-Bag Randomizer implementation with Fisher-Yates shuffle
 */

import { PIECE_TYPES } from './constants.js';

const ALL_PIECES = [
  PIECE_TYPES.I,
  PIECE_TYPES.O,
  PIECE_TYPES.T,
  PIECE_TYPES.S,
  PIECE_TYPES.Z,
  PIECE_TYPES.J,
  PIECE_TYPES.L,
];

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleBag(rng = Math.random) {
  const bag = [...ALL_PIECES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = bag[i];
    bag[i] = bag[j];
    bag[j] = temp;
  }
  return bag;
}

/**
 * Creates and manages bag state and next queue
 */
export class BagManager {
  constructor(rng = Math.random) {
    this.rng = rng;
    this.bag = [];
    this.queue = [];
    this.refillQueue(6);
  }

  refillQueue(minSize = 6) {
    while (this.queue.length < minSize) {
      if (this.bag.length === 0) {
        this.bag = shuffleBag(this.rng);
      }
      this.queue.push(this.bag.pop());
    }
  }

  next() {
    this.refillQueue(6);
    const nextPiece = this.queue.shift();
    this.refillQueue(6);
    return nextPiece;
  }

  peek(count = 5) {
    this.refillQueue(count + 1);
    return this.queue.slice(0, count);
  }
}
