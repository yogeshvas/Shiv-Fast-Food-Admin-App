import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const MenuManagement = ({navigation}: any) => {
  return (
    <View>
      <View
        style={{
          height: 70,
          backgroundColor: '#597445',
          paddingHorizontal: 20,
          gap: 5,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={{width: 17, height: 20}}
            source={require('../assets/images/back.png')}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: 'Space-Bold',
            color: 'white',
            fontSize: 17,
            marginLeft: 10,
          }}>
          Menu Management
        </Text>
      </View>
    </View>
  );
};

export default MenuManagement;

const styles = StyleSheet.create({});
