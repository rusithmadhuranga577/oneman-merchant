import React, { useEffect, useState } from 'react';
import Router from './src/router/Router';
import { LogBox, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import { BackgroundJob, PulseAnimationScreen } from '@components';
import { DrawerTogleButton } from '@components';

const App = () => {

  useEffect(()=>{
    LogBox.ignoreAllLogs()
  },[])

  return (
    <>
      <Router/>
      <FlashMessage position="top" />
    </>
  );
};

export default App;