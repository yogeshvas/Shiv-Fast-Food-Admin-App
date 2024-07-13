import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery} from '@tanstack/react-query';
import useGetDashboardData from '../services/hooks/getDashboardData';

const Dashboard = () => {
  const {data, isLoading, refetch} = useGetDashboardData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#597445', '#87A96E']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {/* left */}
          <View>
            <Text
              style={{
                color: '#E3E3E3',
                fontFamily: 'Space-Medium',
                fontSize: 15,
              }}>
              Welcome
            </Text>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Space-Bold',
                fontSize: 20,
              }}>
              Shiv Dhaba Restaurant
            </Text>
          </View>
          {/* right */}
          <View
            style={{
              height: 40,
              backgroundColor: 'white',
              width: 40,
              borderRadius: 200,
            }}></View>
        </View>
      </LinearGradient>
      {isLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={'#729762'} />
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Space-Bold',
              marginTop: 10,
              color: '#729762',
            }}>
            Loading Data!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              gap: 10,
              margin: 10,
              marginTop: 15,
            }}>
            {/* left box */}
            <View style={[styles.box, {backgroundColor: '#729762'}]}>
              <Text style={styles.boxText}>Current Orders</Text>
              <Text
                style={{
                  fontSize: 35,
                  fontFamily: 'Space-SemiBold',
                  color: 'white',
                }}>
                {data?.acceptedOrders}
              </Text>
            </View>
            {/* right box */}
            <View style={[styles.box, {backgroundColor: '#729762'}]}>
              <Text style={styles.boxText}>All Orders</Text>
              <Text
                style={{
                  fontSize: 35,
                  fontFamily: 'Space-SemiBold',
                  color: 'white',
                }}>
                {data.allOrders}
              </Text>
            </View>
          </View>
          {/* row 2 */}
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              gap: 10,
              margin: 10,
            }}>
            {/* left box */}
            <View style={[styles.box, {backgroundColor: '#729762'}]}>
              <Text style={styles.boxText}>Today's Revenue</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: 5,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Space-SemiBold',
                    color: 'white',
                    marginBottom: 4,
                  }}>
                  Rs
                </Text>
                <Text
                  style={{
                    fontSize: 35,
                    fontFamily: 'Space-SemiBold',
                    color: 'white',
                  }}>
                  {data.totalAmountToday}
                </Text>
              </View>
            </View>
            {/* right box */}
            <View style={[styles.box, {backgroundColor: '#729762'}]}>
              <Text style={styles.boxText}>Month's Revenue</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: 5,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Space-SemiBold',
                    color: 'white',
                    marginBottom: 4,
                  }}>
                  Rs
                </Text>
                <Text
                  style={{
                    fontSize: 35,
                    fontFamily: 'Space-SemiBold',
                    color: 'white',
                  }}>
                  {data.totalAmountMonthly}
                </Text>
              </View>
            </View>
          </View>
          <View></View>
        </ScrollView>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gradient: {
    height: 90,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  box: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  boxText: {
    fontFamily: 'Space-Medium',
    color: 'white',
    fontSize: 14,
  },
});
