import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Button, LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {
  Canvas,
  Group,
  Skia,
  Path,
  Mask,
  Rect,
  Image,
  useImage,
  SkPath,
} from '@shopify/react-native-skia';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {svgPathProperties} from 'svg-path-properties';

interface ILayersProps {
  width: number;
  height: number;
}

// Component shown on card being scratched
const Offer = ({width, height}: ILayersProps) => {
  const offerImage = useImage(require('./offer.png'));
  return (
    offerImage && (
      <Image image={offerImage} fit="contain" width={width} height={height} />
    )
  );
};

// Scratch pattern on which the user will perform the gesture
const ScratchPattern = ({width, height}: ILayersProps) => {
  const scratchPatternImage = useImage(require('./scratch-pattern.jpg'));

  return (
    scratchPatternImage && (
      <Image
        image={scratchPatternImage}
        fit="cover"
        width={width}
        height={height}
      />
    )
  );
};

export const ScratchCard = () => {
  // Canvas dimensions
  const [canvasLayoutMeta, setCanvasLayoutMeta] = useState({
    width: 0,
    height: 0,
  });

  const STROKE_WIDTH = useRef<number>(40); // width of the scratch stroke
  const totalAreaScratched = useRef<number>(0); // Total area scratched on the scratch card
  const [isScratched, setIsScratched] = useState(false); // is canvas scratched enough (> threshold)
  const [paths, setPaths] = useState<SkPath[]>([]); // user's scratch data in form of svg path

  const pan = Gesture.Pan()
    .onStart(g => {
      const newPaths = [...paths];

      const path = Skia.Path.Make(); // Initiates a new svg path
      path.moveTo(g.x, g.y); // Starting point
      newPaths.push(path);
      setPaths(newPaths);
    })
    .onUpdate(g => {
      const newPaths = [...paths];
      const path = newPaths[newPaths.length - 1]; // Gets the last added path
      path.lineTo(g.x, g.y); // Makes a line to the user's current gesture position
      setPaths(newPaths);
    })
    .onEnd(() => {
      const pathProperties = new svgPathProperties(
        paths[paths.length - 1].toSVGString(),
      );

      const pathArea = pathProperties.getTotalLength() * STROKE_WIDTH.current;
      totalAreaScratched.current += pathArea;
      const {width, height} = canvasLayoutMeta;
      const areaScratched =
        (totalAreaScratched.current / (width * height)) * 100;

      if (areaScratched > 70) {
        setIsScratched(true);
        // Do other stuff like provide a force feedback to the user (Vibration)
        // Disable the gesture handler to avoid registering more inputs (Saves computation and memory)
      }
    })
    .minDistance(1)
    .enabled(!isScratched);

  const handleCanvasLayout = useCallback((e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    setCanvasLayoutMeta({width, height});
  }, []);

  const handleReset = () => {
    setIsScratched(false);
    setPaths([]);
    totalAreaScratched.current = 0;
  };

  const {width, height} = useMemo(() => canvasLayoutMeta, [canvasLayoutMeta]);

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        <Canvas onLayout={handleCanvasLayout} style={styles.canvas}>
          <Offer width={width} height={height} />
          {!isScratched ? (
            <Mask
              clip
              mode="luminance"
              mask={
                <Group>
                  <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    color="white"
                  />
                  {paths.map(p => (
                    <Path
                      key={p.toSVGString()}
                      path={p}
                      strokeWidth={STROKE_WIDTH.current}
                      style="stroke"
                      strokeJoin={'round'}
                      strokeCap={'round'}
                      antiAlias
                      color={'black'}
                    />
                  ))}
                </Group>
              }>
              <ScratchPattern width={width} height={height} />
            </Mask>
          ) : (
            <Offer width={width} height={height} />
          )}
        </Canvas>
        <View style={styles.buttonContainer}>
          <Button title="Reset" onPress={handleReset} />
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: '55%',
    backgroundColor: '#06D6A0',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginTop: 50,
  },
});
export default ScratchCard;
