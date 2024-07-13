import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl} from 'react-native';
import useGetAcceptedOrders from '../../services/hooks/getAcceptedOrders'; // Adjust the path as needed
import OrderAccordion from '../../components/OrderAccordian';
import {useFocusEffect} from '@react-navigation/native';

const Accepted = () => {
  const {data, isLoading, refetch} = useGetAcceptedOrders(); // Assuming this hook fetches your data
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const reversedOrders = data ? [...data].reverse() : [];

  return (
    <View style={styles.container}>
      <FlatList
        data={reversedOrders}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <OrderAccordion data={item} refetch={refetch} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Accepted Orders</Text>
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
    paddingHorizontal: 10,
    backgroundColor: 'white',
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

export default Accepted;
