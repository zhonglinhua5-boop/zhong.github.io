import { interpolate, useCurrentFrame } from "remotion";

export const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 420,
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 36,
        fontWeight: 500,
        textShadow:
          "0 3px 14px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)",
        opacity,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      {text}
    </div>
  );
};
