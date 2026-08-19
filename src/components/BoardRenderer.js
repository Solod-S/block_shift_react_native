/**
 * BoardRenderer Component
 * Renders 10x20 visible grid, dot intersections, 3D rounded tetromino blocks,
 * Ghost projection, and line clear animations.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  BOARD_COLS,
  BOARD_VISIBLE_ROWS,
  BOARD_HIDDEN_ROWS,
  BOARD_TOTAL_ROWS,
} from '../game/constants.js';
import { getPieceCells } from '../game/pieces.js';
import BoardCanopy from './BoardCanopy.js';

export default function BoardRenderer({
  board,
  activePiece,
  ghostPiece,
  ghostEnabled = true,
  clearingRows = [],
  isDanger = false,
  cellSize = 18,
}) {
  const boardWidth = cellSize * BOARD_COLS;
  const boardHeight = cellSize * BOARD_VISIBLE_ROWS;

  // Active piece cells (only those >= hidden rows)
  const activeCells = activePiece ? getPieceCells(activePiece) : [];

  // Ghost piece cells (only if ghost is enabled and different from active piece position)
  const ghostCells =
    ghostEnabled && ghostPiece && activePiece && ghostPiece.y !== activePiece.y
      ? ghostPiece.cells || []
      : [];

  return (
    <View
      style={[
        styles.boardContainer,
        {
          width: boardWidth + 12,
          height: boardHeight + 12,
          borderColor: isDanger ? '#FF4757' : '#3E2568',
        },
      ]}
    >
      {/* Decorative Tree Canopy at the top of the board */}
      <BoardCanopy width={boardWidth + 12} />

      {/* Internal Grid Canvas */}
      <View style={[styles.gridArea, { width: boardWidth, height: boardHeight }]}>
        {/* Background Dots Grid */}
        <Svg width={boardWidth} height={boardHeight} style={StyleSheet.absoluteFillObject}>
          {Array.from({ length: BOARD_VISIBLE_ROWS + 1 }).map((_, r) =>
            Array.from({ length: BOARD_COLS + 1 }).map((_, c) => (
              <Circle
                key={`dot-${r}-${c}`}
                cx={c * cellSize}
                cy={r * cellSize}
                r={1.2}
                fill="rgba(255, 255, 255, 0.18)"
              />
            ))
          )}
        </Svg>

        {/* 1. Locked Board Blocks */}
        {board &&
          board.slice(BOARD_HIDDEN_ROWS).map((row, visualRowIdx) => {
            const actualRowIdx = visualRowIdx + BOARD_HIDDEN_ROWS;
            const isClearing = clearingRows.includes(actualRowIdx);

            return row.map((cellColor, colIdx) => {
              if (!cellColor) return null;

              return (
                <View
                  key={`locked-${actualRowIdx}-${colIdx}`}
                  style={[
                    styles.block,
                    {
                      width: cellSize - 2,
                      height: cellSize - 2,
                      left: colIdx * cellSize + 1,
                      top: visualRowIdx * cellSize + 1,
                      backgroundColor: isClearing ? '#FFFFFF' : cellColor,
                      opacity: isClearing ? 0.9 : 1,
                      transform: isClearing ? [{ scale: 1.08 }] : [{ scale: 1 }],
                    },
                  ]}
                >
                  {/* Top highlight for 3D bevel look */}
                  <View style={styles.blockHighlight} />
                  {/* Bottom edge shadow */}
                  <View style={styles.blockShadow} />
                </View>
              );
            });
          })}

        {/* 2. Ghost Piece Projection */}
        {ghostCells.map((cell, idx) => {
          const visualRow = cell.y - BOARD_HIDDEN_ROWS;
          if (visualRow < 0 || visualRow >= BOARD_VISIBLE_ROWS) return null;

          return (
            <View
              key={`ghost-${idx}`}
              style={[
                styles.ghostBlock,
                {
                  width: cellSize - 2,
                  height: cellSize - 2,
                  left: cell.x * cellSize + 1,
                  top: visualRow * cellSize + 1,
                  borderColor: cell.color || '#FFFFFF',
                  backgroundColor: cell.color || '#FFFFFF',
                },
              ]}
            />
          );
        })}

        {/* 3. Active Falling Piece */}
        {activeCells.map((cell, idx) => {
          const visualRow = cell.y - BOARD_HIDDEN_ROWS;
          if (visualRow < 0 || visualRow >= BOARD_VISIBLE_ROWS) return null;

          return (
            <View
              key={`active-${idx}`}
              style={[
                styles.block,
                {
                  width: cellSize - 2,
                  height: cellSize - 2,
                  left: cell.x * cellSize + 1,
                  top: visualRow * cellSize + 1,
                  backgroundColor: cell.color,
                },
              ]}
            >
              <View style={styles.blockHighlight} />
              <View style={styles.blockShadow} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    backgroundColor: '#190E38',
    borderRadius: 24,
    borderWidth: 3,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
  },
  gridArea: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#160B31',
  },
  block: {
    position: 'absolute',
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  blockHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  blockShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  ghostBlock: {
    position: 'absolute',
    borderRadius: 5,
    borderWidth: 1.5,
    opacity: 0.28,
  },
});
