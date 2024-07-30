import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RoutingNavigation from './src/navigation/RoutingNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'react-native';

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="light-content" backgroundColor="#597445" />
      <NavigationContainer>
        <RoutingNavigation />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
