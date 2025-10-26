import { Trash2 } from "lucide-react";
import { useState } from "react";

interface JarCardProps {
  goal: {
    id: string;
    goal_name: string;
    total_amount: number;
    remaining_amount: number;
  };
  onDelete: (id: string) => void;
}

export default function JarCard({ goal, onDelete }: JarCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const progress =
    goal.total_amount === 0
      ? 0
      : ((goal.total_amount - goal.remaining_amount) / goal.total_amount) * 100;
  const fillPercentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <svg
          viewBox="0 0 200 280"
          className="w-full h-auto drop-shadow-lg transition-transform hover:scale-105"
        >
          <defs>
            <linearGradient
              id={`jarGradient-${goal.id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient
              id={`coinsGradient-${goal.id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <filter id={`shadow-${goal.id}`}>
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="0" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id={`jarClip-${goal.id}`}>
              <path d="M 60 40 L 60 30 Q 60 20 70 20 L 130 20 Q 140 20 140 30 L 140 40 L 150 45 Q 160 50 160 60 L 160 240 Q 160 255 145 255 L 55 255 Q 40 255 40 240 L 40 60 Q 40 50 50 45 Z" />
            </clipPath>
          </defs>

          <g filter={`url(#shadow-${goal.id})`}>
            <path
              d="M 60 40 L 60 30 Q 60 20 70 20 L 130 20 Q 140 20 140 30 L 140 40 L 150 45 Q 160 50 160 60 L 160 240 Q 160 255 145 255 L 55 255 Q 40 255 40 240 L 40 60 Q 40 50 50 45 Z"
              fill={`url(#jarGradient-${goal.id})`}
              stroke="#94a3b8"
              strokeWidth="2"
            />

            <ellipse
              cx="100"
              cy="40"
              rx="40"
              ry="8"
              fill="#e0e7ff"
              stroke="#94a3b8"
              strokeWidth="2"
              opacity="0.6"
            />
          </g>

          <g clipPath={`url(#jarClip-${goal.id})`}>
            {fillPercentage > 0 && (
              <>
                <defs>
                  {/* Pattern for coins and notes */}
                  <pattern
                    id={`moneyPattern-${goal.id}`}
                    patternUnits="userSpaceOnUse"
                    width="40"
                    height="40"
                  >
                    {/* Coins */}
                    <circle
                      cx="10"
                      cy="10"
                      r="6"
                      fill="#d4af37"
                      opacity="0.9"
                    />
                    <circle
                      cx="30"
                      cy="20"
                      r="5"
                      fill="#b8860b"
                      opacity="0.8"
                    />
                    <circle
                      cx="15"
                      cy="30"
                      r="4"
                      fill="#fcd34d"
                      opacity="0.85"
                    />
                    {/* Notes */}
                    <rect
                      x="20"
                      y="5"
                      width="14"
                      height="8"
                      fill="#9ef01a"
                      opacity="0.7"
                      transform="rotate(-10 20 5)"
                    />
                    <rect
                      x="5"
                      y="22"
                      width="16"
                      height="7"
                      fill="#2dd4bf"
                      opacity="0.7"
                      transform="rotate(15 5 22)"
                    />
                  </pattern>
                </defs>

                {/* Money fill area */}
                <rect
                  x="40"
                  y={255 - (215 * fillPercentage) / 100}
                  width="120"
                  height={(215 * fillPercentage) / 100}
                  fill={`url(#moneyPattern-${goal.id})`}
                  opacity="0.95"
                />
              </>
            )}
          </g>

          <path
            d="M 60 40 L 60 30 Q 60 20 70 20 L 130 20 Q 140 20 140 30 L 140 40 L 150 45 Q 160 50 160 60 L 160 240 Q 160 255 145 255 L 55 255 Q 40 255 40 240 L 40 60 Q 40 50 50 45 Z"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            opacity="0.4"
          />

          <ellipse
            cx="100"
            cy="40"
            rx="40"
            ry="8"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            opacity="0.5"
          />

          <ellipse
            cx="80"
            cy="120"
            rx="20"
            ry="35"
            fill="white"
            opacity="0.15"
          />
        </svg>

        {showTooltip && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl z-10 whitespace-nowrap">
            <div className="text-sm space-y-1">
              <div className="font-semibold">
                Total: ${goal.total_amount.toLocaleString()}
              </div>
              <div className="text-gray-300">
                Remaining: ${goal.remaining_amount.toLocaleString()}
              </div>
              <div className="text-emerald-400">
                Progress: {fillPercentage.toFixed(1)}%
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center space-y-2 w-full">
        <h3 className="font-semibold text-gray-800 text-lg truncate px-2">
          {goal.goal_name}
        </h3>
        <button
          onClick={() => onDelete(goal.id)}
          className="flex items-center gap-2 mx-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Delete</span>
        </button>
      </div>
    </div>
  );
}
