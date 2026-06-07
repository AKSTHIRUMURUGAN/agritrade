import React from 'react';

export default function PriceLineChart({ amounts = [], labels = [] }) {
  if (amounts.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-zinc-400 bg-zinc-900/50 rounded-xl border border-zinc-800">
        No price history available
      </div>
    );
  }

  // If there's only 1 amount, duplicate it to show a flat line
  const data = amounts.length === 1 ? [amounts[0], amounts[0]] : amounts;
  
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const valRange = maxVal - minVal;
  const paddingRatio = 0.15; // 15% padding top and bottom

  const minBoundary = valRange === 0 ? minVal - 10 : minVal - valRange * paddingRatio;
  const maxBoundary = valRange === 0 ? maxVal + 10 : maxVal + valRange * paddingRatio;
  const totalRange = maxBoundary - minBoundary;

  const width = 500;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute points
  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((val - minBoundary) / totalRange) * chartHeight;
    return { x, y, val };
  });

  // Generate SVG Path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  // Dynamic date/label fallback
  const displayLabels = labels.length > 0 
    ? labels 
    : data.map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - 1 - i) * 3); // 3 days intervals
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      });

  // Calculate ticks
  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks }, (_, i) => {
    return minBoundary + (i / (yTicks - 1)) * totalRange;
  });

  return (
    <div className="w-full bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 shadow-inner">
      <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">Price Trend History</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {/* Grid lines (horizontal) */}
        {tickValues.map((val, i) => {
          const y = paddingTop + chartHeight - ((val - minBoundary) / totalRange) * chartHeight;
          return (
            <g key={i} className="opacity-20">
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#4b5563"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                fill="#9ca3af"
                fontSize={10}
                textAnchor="end"
                className="font-medium"
              >
                ₹{Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Fill Area Under the Curve */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Line Curve */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Circular Dots / Points */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r={5}
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth={2}
              className="transition-all duration-150 group-hover:r-7"
            />
            {/* Popover values on hover */}
            <rect
              x={p.x - 25}
              y={p.y - 28}
              width={50}
              height={18}
              rx={4}
              fill="#1f2937"
              stroke="#374151"
              strokeWidth={1}
              className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            />
            <text
              x={p.x}
              y={p.y - 16}
              fill="#ffffff"
              fontSize={9}
              textAnchor="middle"
              className="font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              ₹{p.val}
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((p, i) => {
          // Render alternate labels or first/last if too many to avoid overlapping
          const shouldShowLabel = points.length <= 6 || i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2);
          if (!shouldShowLabel) return null;

          return (
            <text
              key={i}
              x={p.x}
              y={height - paddingBottom + 18}
              fill="#9ca3af"
              fontSize={10}
              textAnchor="middle"
              className="font-medium"
            >
              {displayLabels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
