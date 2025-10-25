import { motion } from "framer-motion";

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function PieChart({ data }: PieChartProps) {
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

  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(100, 100, 80, endAngle);
    const end = polarToCartesian(100, 100, 80, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      100,
      100,
      "L",
      start.x,
      start.y,
      "A",
      80,
      80,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  return (
    <div className="w-full max-w-[350px] sm:max-w-[400px] flex flex-col items-center">
      <svg
        viewBox="0 0 200 200"
        className="w-64 h-64 sm:w-72 sm:h-72 transition-transform duration-300 hover:scale-105"
      >
        {slices.map((slice, index) => (
          <motion.path
            key={index}
            d={createArcPath(slice.startAngle, slice.endAngle)}
            fill={slice.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 + index * 0.2 }}
            whileHover={{ scale: 1.03 }}
          />
        ))}
        <circle cx="100" cy="100" r="50" fill="white" />
      </svg>
      <div className="mt-4 space-y-2 w-full">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center justify-between px-2">
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
