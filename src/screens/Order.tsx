import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Active from './order-tabs/Active';
import Accepted from './order-tabs/Accepted';
import Delivered from './order-tabs/Delivered';
import All from './order-tabs/All';

const FirstRoute = () => <Active />;

const SecondRoute = () => <Accepted />;

const ThirdRoute = () => <Delivered />;

const FourthRoute = () => <All />;

const initialLayout = {width: Dimensions.get('window').width};

const Order = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Active'},
    {key: 'second', title: 'Accepted'},
    {key: 'third', title: 'Delivered'},
    {key: 'fourth', title: 'All'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'black'}}
      style={{backgroundColor: 'white'}}
      lazy={false}
      labelStyle={{
        textTransform: 'capitalize',
        fontFamily: 'Space-Medium',
        color: 'black', // Default color for inactive tabs
      }}
      renderLabel={({route, focused, color}) => (
        <Text
          style={{
            color: focused ? 'black' : 'gray', // Green for active, gray for inactive
            textTransform: 'capitalize',
            fontFamily: 'Space-Medium',
          }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <>
      <View
        style={{
          height: 70,
          backgroundColor: '#597445',
          padding: 10,
          justifyContent: 'center',
        }}>
        {/* header */}

        <Text
          style={{
            fontFamily: 'Space-Bold',
            color: 'white',
            fontSize: 17,
            marginLeft: 10,
          }}>
          Orders
        </Text>
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default Order;
