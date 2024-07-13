import {StyleSheet, Image} from 'react-native';
import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import Order from '../screens/Order';
import More from '../screens/More';
import MenuManagement from '../screens/MenuManagement';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName: any, focused: any) => {
  let iconSource;

  switch (routeName) {
    case 'Dashboard':
      iconSource = focused
        ? require('../assets/images/dashboard.png')
        : require('../assets/images/dashboard-inactive.png');
      break;
    case 'Order':
      iconSource = focused
        ? require('../assets/images/order.png')
        : require('../assets/images/order-inactive.png');
      break;
    case 'More':
      iconSource = focused
        ? require('../assets/images/more.png')
        : require('../assets/images/more-inactive.png');
      break;
    default:
      iconSource = require('../assets/images/more.png');
  }

  return <Image source={iconSource} style={styles.icon} />;
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#919191',
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabel, // Add this line
        tabBarIcon: ({focused}) => getTabBarIcon(route.name, focused),
      })}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Order"
        component={Order}
        options={{headerShown: false}}
      />
      <Tab.Screen name="More" component={More} options={{headerShown: false}} />

      {/* Uncomment the following lines if you have these components */}
      {/* <Tab.Screen
        name="Ambulance"
        component={Ambulance}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Courier"
        component={Courier}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      /> */}
    </Tab.Navigator>
  );
}

const RoutingNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="menu-management"
        component={MenuManagement}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default RoutingNavigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 65,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#597445', // Customize as per your design
  },
  tabBarLabel: {
    fontFamily: 'Space-Bold',
  },
  icon: {
    width: 24, // Adjust the size of the icons as needed
    height: 24,
  },
});
