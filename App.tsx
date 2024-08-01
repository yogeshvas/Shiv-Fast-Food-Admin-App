import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import RoutingNavigation from './src/navigation/RoutingNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const queryClient = new QueryClient();
const App = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('This is my FCM Token', fcmToken);
  }, [fcmToken]);

  const checkFCM = async () => {
    try {
      const fcm = await messaging().getToken();
      setFcmToken(fcm);
    } catch (error) {
      console.error('Error fetching FCM token', error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const subscribeToTopic = async () => {
    try {
      await messaging().subscribeToTopic('orders');
      console.log('Subscribed to orders topic!');
    } catch (error) {
      console.error('Failed to subscribe to orders topic', error);
    }
  };

  useEffect(() => {
    requestUserPermission();
    checkFCM();
    subscribeToTopic();

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
  }, []);

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
