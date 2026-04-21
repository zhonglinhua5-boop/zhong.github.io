import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { z } from "zod";
import { Scene, sceneSchema } from "./Scene";

export const videoSchema = z.object({
  scenes: z.array(sceneSchema),
});

export type VideoProps = z.infer<typeof videoSchema>;

export const Video: React.FC<VideoProps> = ({ scenes }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#08080F" }}>
      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence
            key={i}
            durationInFrames={scene.durationFrames}
            layout="none"
          >
            <Scene {...scene} index={i} />
            {scene.audio ? (
              <Audio src={staticFile(scene.audio)} volume={1.5} />
            ) : null}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
