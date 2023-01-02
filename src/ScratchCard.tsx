import React, {useCallback, useState} from 'react';
import {LayoutChangeEvent, StyleSheet} from 'react-native';
import {Image, useImage} from '@shopify/react-native-skia';

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

  const handleCanvasLayout = useCallback((e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    setCanvasLayoutMeta({width, height});
  }, []);

  return <></>;
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
});
export default ScratchCard;
