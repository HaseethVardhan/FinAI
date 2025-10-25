import { motion } from "framer-motion";
import { useState } from "react";

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function PieChart({ data }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#6366f1",
  ];

  let currentAngle = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
      color: colors[index % colors.length],
    };
  });

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArcPath = (startAngle: number, endAngle: number, radius = 80) => {
    const start = polarToCartesian(100, 100, radius, endAngle);
    const end = polarToCartesian(100, 100, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      100,
      100,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  return (
    <div className="w-full max-w-[350px] sm:max-w-[400px] flex flex-col items-center relative">
      <svg
        viewBox="0 0 200 200"
        className="w-64 h-64 sm:w-72 sm:h-72 transition-transform duration-300 hover:scale-105"
      >
        {slices.map((slice, index) => {
          // Calculate mid-angle for hover offset
          const midAngle = (slice.startAngle + slice.endAngle) / 2;
          const offsetRadius = hoveredIndex === index ? 10 : 0;
          const offsetX =
            offsetRadius * Math.cos(((midAngle - 90) * Math.PI) / 180);
          const offsetY =
            offsetRadius * Math.sin(((midAngle - 90) * Math.PI) / 180);

          return (
            <motion.g
              key={index}
              transform={`translate(${offsetX}, ${offsetY})`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.05 }}
            >
              <motion.path
                d={createArcPath(slice.startAngle, slice.endAngle)}
                fill={slice.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 + index * 0.2 }}
              />
            </motion.g>
          );
        })}

        {/* Inner circle */}
        <circle cx="100" cy="100" r="50" fill="white" />

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <text
              x="100"
              y="90"
              textAnchor="middle"
              className="fill-gray-800 font-semibold text-sm sm:text-base"
            >
              {slices[hoveredIndex].name}
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="fill-gray-600 text-xs sm:text-sm"
            >
              {slices[hoveredIndex].value} (
              {slices[hoveredIndex].percentage.toFixed(1)}%)
            </text>
          </motion.g>
        )}
      </svg>

      <div className="mt-4 space-y-2 w-full">
        {slices.map((slice, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-2 rounded transition-all ${
              hoveredIndex === index ? "bg-gray-100 scale-105" : ""
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm sm:text-base text-gray-700">
                {slice.name}
              </span>
            </div>
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              {slice.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
