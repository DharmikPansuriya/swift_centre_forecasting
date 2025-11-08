import { useMemo } from "react";
import { splitIntoPoints } from "../lib/text";

type PointListProps = {
  text?: string | null;
  points?: string[];
  className?: string;
};

export default function PointList({ text, points, className }: PointListProps) {
  const items = useMemo(() => {
    if (points && points.length > 0) {
      return points.filter(Boolean).map((point) => point.trim()).filter(Boolean);
    }
    if (text) {
      return splitIntoPoints(text);
    }
    return [];
  }, [points, text]);

  if (items.length === 0) {
    return null;
  }

  const classes = ["point-list"];
  if (className) {
    classes.push(className);
  }

  return (
    <ul className={classes.join(" ")}>
      {items.map((item, index) => (
        <li key={`${index}-${item.slice(0, 16)}`}>{item}</li>
      ))}
    </ul>
  );
}

