import { Board } from "../models/game";

interface Props {
  board: Board;
  disabled: boolean;
  onMove: (index: number) => void;
}

export const GameBoard = ({ board, disabled, onMove }: Props) => (
  <div className="board" aria-label="game board">
    {board.map((cell, index) => (
      <button
        key={index}
        className="cell"
        onClick={() => onMove(index)}
        disabled={disabled || Boolean(cell)}
        aria-label={`cell-${index}`}
      >
        {cell}
      </button>
    ))}
  </div>
);
