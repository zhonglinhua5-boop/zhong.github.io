import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = { value: string; label: string; color: string };

export const DataHighlight: React.FC<Props> = ({ value, label, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(frame - 14, 0), fps, config: { damping: 14, stiffness: 160 } });

  // Pulse effect
  const pulse = 1 + Math.sin(frame / 10) * 0.03;
  const glow = 0.6 + Math.sin(frame / 10) * 0.3;

  // Try to animate number portion if it's numeric
  const match = value.match(/^([^\d]*)(\d[\d,.]*)(.*)$/);
  let displayValue = value;
  if (match) {
    const [, pre, num, post] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    const progress = interpolate(frame, [14, 34], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const current = target * progress;
    const formatted =
      num.includes(".") || target < 10
        ? current.toFixed(1)
        : Math.round(current).toLocaleString();
    displayValue = `${pre}${formatted}${post}`;
  }

  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        transform: `scale(${s * pulse})`,
        opacity: Math.min(1, s * 1.2),
      }}
    >
      <div
        style={{
          fontSize: 130,
          fontWeight: 900,
          color,
          letterSpacing: "-3px",
          WebkitTextStroke: "4px rgba(0,0,0,0.8)",
          paintOrder: "stroke fill" as never,
          textShadow: `0 0 ${40 * glow}px ${color}, 0 4px 20px rgba(0,0,0,0.8)`,
          lineHeight: 1,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 600,
          color: "#FFFFFF",
          marginTop: 14,
          textShadow: "0 2px 10px rgba(0,0,0,0.7)",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        {label}
      </div>
    </div>
  );
};
