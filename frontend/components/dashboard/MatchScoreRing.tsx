"use client";

interface MatchScoreRingProps {
  score: number;
  size?: number;
}

export default function MatchScoreRing({ score, size = 96 }: MatchScoreRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75
      ? { stroke: "#10b981", text: "text-emerald-400", label: "text-emerald-500" }
      : score >= 50
      ? { stroke: "#f59e0b", text: "text-amber-400", label: "text-amber-500" }
      : { stroke: "#ef4444", text: "text-red-400", label: "text-red-500" };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth={6}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold font-fraunces ${color.text}`}>
            {score}
          </span>
        </div>
      </div>
      <span className={`text-[11px] font-medium uppercase tracking-widest ${color.label}`}>
        {score >= 75 ? "Strong match" : score >= 50 ? "Good match" : "Weak match"}
      </span>
    </div>
  );
}
