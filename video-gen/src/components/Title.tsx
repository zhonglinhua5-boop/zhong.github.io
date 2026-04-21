import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type TitleProps = { text: string; accentColor: string };

const TitleBase: React.FC<TitleProps> = ({ text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // delay=0 means instantly visible (no black fade-in)
  const s = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const translateY = (1 - s) * 40;

  return (
    <h1
      style={{
        fontSize: 135,
        fontWeight: 900,
        color: accentColor,
        letterSpacing: "-2px",
        margin: 0,
        lineHeight: 1.05,
        WebkitTextStroke: "5px rgba(0,0,0,0.8)",
        paintOrder: "stroke fill" as never,
        textShadow:
          "0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,229,0,0.15)",
        transform: `translateY(${translateY}px)`,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      {text}
    </h1>
  );
};

const Subtitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(frame - 6, 0), fps, config: { damping: 16, stiffness: 140 } });
  const translateY = (1 - s) * 30;
  const opacity = Math.min(1, s * 1.2);

  return (
    <h2
      style={{
        fontSize: 48,
        fontWeight: 700,
        color: "#FFFFFF",
        margin: 0,
        WebkitTextStroke: "2px rgba(0,0,0,0.6)",
        paintOrder: "stroke fill" as never,
        textShadow: "0 2px 10px rgba(0,0,0,0.7)",
        transform: `translateY(${translateY}px)`,
        opacity,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      {text}
    </h2>
  );
};

export const Title = Object.assign(TitleBase, { Subtitle });
