import React from "react";
import { Composition } from "remotion";
import { Video, videoSchema } from "./Video";
import demoProps from "../content/demo.props.json";

export const Root: React.FC = () => {
  const scenes = demoProps.scenes;
  const totalFrames = scenes.reduce(
    (sum: number, s: { durationFrames: number }) => sum + s.durationFrames,
    0
  );

  return (
    <Composition
      id="Main"
      component={Video}
      durationInFrames={Math.max(totalFrames, 30)}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={demoProps}
      schema={videoSchema}
      calculateMetadata={({ props }) => {
        const frames = props.scenes.reduce(
          (sum: number, s: { durationFrames: number }) => sum + s.durationFrames,
          0
        );
        return {
          durationInFrames: Math.max(frames, 30),
        };
      }}
    />
  );
};
