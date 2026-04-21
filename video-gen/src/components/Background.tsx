import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

type Props = {
  bgVideo?: string;
  bgGradient?: string[];
  accentColor: string;
};

export const Background: React.FC<Props> = ({ bgVideo, bgGradient, accentColor }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {bgVideo ? (
        <OffthreadVideo
          src={staticFile(bgVideo)}
          playbackRate={0.7}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background: bgGradient
              ? `linear-gradient(135deg, ${bgGradient.join(", ")})`
              : "linear-gradient(135deg, #0b0f2a, #1a0a2e, #0a1a2a)",
          }}
        />
      )}

      {/* 70% dark overlay */}
      <AbsoluteFill style={{ backgroundColor: "rgba(8,8,15,0.7)" }} />

      {/* Top and bottom vignette */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Pulsing radial glow */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
            filter: "blur(100px)",
            opacity: 0.6 + Math.sin(frame / 18) * 0.2,
          }}
        />
      </AbsoluteFill>

      <Particles accentColor={accentColor} />
    </AbsoluteFill>
  );
};

const PARTICLE_CONFIG = [
  { x: 12, y: 20, size: 18, speed: 0.04, amp: 36, color: "#FFE500" },
  { x: 85, y: 15, size: 12, speed: 0.06, amp: 28, color: "#4DD0E1" },
  { x: 20, y: 60, size: 22, speed: 0.03, amp: 42, color: "#FF6EC7" },
  { x: 78, y: 55, size: 14, speed: 0.05, amp: 30, color: "#B388FF" },
  { x: 45, y: 78, size: 20, speed: 0.035, amp: 48, color: "#FFD54F" },
  { x: 62, y: 30, size: 10, speed: 0.07, amp: 24, color: "#80DEEA" },
  { x: 8, y: 88, size: 16, speed: 0.045, amp: 32, color: "#F48FB1" },
  { x: 92, y: 82, size: 14, speed: 0.055, amp: 26, color: "#CE93D8" },
];

const Particles: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {PARTICLE_CONFIG.map((p, i) => {
        const t = frame * p.speed;
        const offsetY = Math.sin(t + i) * p.amp;
        const offsetX = Math.cos(t * 0.7 + i) * (p.amp * 0.4);
        const opacity = 0.45 + Math.sin(t * 1.3 + i) * 0.25;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              transform: `translate(${offsetX}px, ${offsetY}px)`,
              opacity,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${accentColor}33`,
              filter: "blur(1.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
