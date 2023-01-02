import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ScratchCard from './src/ScratchCard';

const windowInitial = Dimensions.get('window');
const App = () => {
  const [dimensions, setDimensions] = useState({window: windowInitial});

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions({window});
    });
    return () => subscription?.remove();
  });

  return (
    <SafeAreaView>
      <GestureHandlerRootView>
        <View
          style={[
            styles.root,
            {
              width: dimensions.window.width,
              height: dimensions.window.height,
            },
          ]}>
          <ScratchCard />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
