import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = { text: string; index: number; accentColor: string };

export const Card: React.FC<Props> = ({ text, index, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = 10 + index * 9;
  const s = spring({
    frame: Math.max(frame - delay, 0),
    fps,
    config: { damping: 16, stiffness: 140 },
  });
  const opacity = frame < delay ? 0 : Math.min(1, s * 1.2);
  const translateX = (1 - s) * (index % 2 === 0 ? -80 : 80);

  return (
    <div
      style={{
        width: "100%",
        padding: "22px 28px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${accentColor}40`,
        color: "#FFFFFF",
        fontSize: 34,
        fontWeight: 600,
        lineHeight: 1.35,
        textAlign: "center",
        opacity,
        transform: `translateX(${translateX}px)`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      {text}
    </div>
  );
};
