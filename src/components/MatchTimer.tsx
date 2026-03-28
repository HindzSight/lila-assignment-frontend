interface Props {
  enabled: boolean;
  seconds: number;
}

export const MatchTimer = ({ enabled, seconds }: Props) => {
  if (!enabled) {
    return null;
  }

  return <p className="meta">Time left: <strong>{seconds}s</strong></p>;
};
