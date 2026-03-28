interface Props {
  turn: "X" | "O";
}

export const TurnIndicator = ({ turn }: Props) => (
  <p className="meta">Turn: <strong>{turn}</strong></p>
);
