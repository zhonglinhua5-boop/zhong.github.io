import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { Background } from "./components/Background";
import { Title } from "./components/Title";
import { Card } from "./components/Card";
import { Caption } from "./components/Caption";
import { DataHighlight } from "./components/DataHighlight";

export const sceneSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  cards: z.array(z.string()).optional(),
  highlight: z
    .object({
      value: z.string(),
      label: z.string(),
      color: z.string().optional(),
    })
    .optional(),
  caption: z.string().optional(),
  bgVideo: z.string().optional(),
  bgGradient: z.array(z.string()).optional(),
  accentColor: z.string().optional(),
  durationFrames: z.number(),
  audio: z.string().optional(),
});

export type SceneProps = z.infer<typeof sceneSchema> & { index: number };

export const Scene: React.FC<SceneProps> = ({
  title,
  subtitle,
  cards,
  highlight,
  caption,
  bgVideo,
  bgGradient,
  accentColor = "#FFE500",
  index,
}) => {
  const frame = useCurrentFrame();
  // Scene fade-in in first 8 frames
  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      <Background bgVideo={bgVideo} bgGradient={bgGradient} accentColor={accentColor} />

      <AbsoluteFill
        style={{
          padding: "180px 80px 480px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <Title text={title} accentColor={accentColor} />
          {subtitle ? <Title.Subtitle text={subtitle} /> : null}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            width: "100%",
            padding: "40px 0",
          }}
        >
          {cards?.map((text, i) => (
            <Card key={i} text={text} index={i} accentColor={accentColor} />
          ))}
          {highlight ? (
            <DataHighlight
              value={highlight.value}
              label={highlight.label}
              color={highlight.color ?? accentColor}
            />
          ) : null}
        </div>
      </AbsoluteFill>

      {caption ? <Caption text={caption} /> : null}
    </AbsoluteFill>
  );
};
