import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl} from 'react-native';

import useGetActiveOrders from '../../services/hooks/getActiveOrders'; // Adjust the path as needed
import OrderAccordion from '../../components/OrderAccordian';
import {useFocusEffect} from '@react-navigation/native';

const Active = () => {
  const {data, isLoading, refetch} = useGetActiveOrders();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  if (isLoading) {
    return (
      <>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'black', fontFamily: 'Space-Bold'}}>
            Loading...
          </Text>
        </View>
      </>
    );
  }
  const reversedOrders = [...data].reverse();

  return (
    <View style={styles.container}>
      <FlatList
        data={reversedOrders}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false} // Add this line to hide the scrollbar
        renderItem={({item}) => (
          <OrderAccordion data={item} refetch={refetch} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Active Orders</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#597445']} // Optional: Set custom refresh indicator colors
            progressBackgroundColor="#ffffff" // Optional: Set custom background color for refresh indicator
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Space-Bold',
    color: 'black',
  },
});

export default Active;
