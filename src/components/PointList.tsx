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
      return points
        .filter(Boolean)
        .map((point) => point.trim())
        .filter(Boolean);
    }
    if (text) {
      return splitIntoPoints(text);
    }
    return [];
  }, [points, text]);

  if (items.length === 0) {
    return null;
  }

  return (
    <ul
      className={[
        "ml-5 list-disc space-y-2 text-justify text-[0.95rem] leading-[1.55] text-[#0b1526]/80",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item, index) => (
        <li
          key={`${index}-${item.slice(0, 16)}`}
          className="marker:text-[#4c62ff] text-inherit"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
