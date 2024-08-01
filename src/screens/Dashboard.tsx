import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery} from '@tanstack/react-query';
import {LineChart, Grid, XAxis, YAxis} from 'react-native-svg-charts';
import {G, Line, Text as SVGText} from 'react-native-svg';
import * as shape from 'd3-shape';
import useGetDashboardData from '../services/hooks/getDashboardData';

const Dashboard = () => {
  const {data, isLoading, refetch} = useGetDashboardData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  const xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate the current day index
  const todayIndex = new Date().getDay() - 1; // getDay() returns 0 for Sunday, 1 for Monday, etc.
  if (todayIndex === -1) todayIndex = 6; // Adjust for Sunday as the start of the week

  // Find the peak value for the current day
  const todayPeakValue = data?.weeklyEarnings[todayIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#597445', '#87A96E']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.restaurantName}>Shiv Dhaba Restaurant</Text>
          </View>
          <View style={styles.profilePic}>
            <Image
              style={{width: 40, height: 40}}
              source={require('../assets/images/user.png')}
            />
          </View>
        </View>
      </LinearGradient>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={'#729762'} />
          <Text style={styles.loadingText}>Loading Data!</Text>
        </View>
      ) : (
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.row}>
            <View style={[styles.box, {backgroundColor: '#729762'}]}>
              <Text style={styles.boxText}>Current Orders</Text>
              <Text style={styles.boxValue}>{data?.acceptedOrders}</Text>
            </View>
            <View style={[styles.box, {backgroundColor: '#729762'}]}>
              <Text style={styles.boxText}>All Orders</Text>
              <Text style={styles.boxValue}>{data.allOrders}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.box, {backgroundColor: '#729762'}]}>
              <Text style={styles.boxText}>Today's Revenue</Text>
              <View style={styles.revenueContainer}>
                <Text style={styles.revenueText}>Rs</Text>
                <Text style={styles.boxValue}>{data.totalAmountToday}</Text>
              </View>
            </View>
            <View style={[styles.box, {backgroundColor: '#729762'}]}>
              <Text style={styles.boxText}>Month's Revenue</Text>
              <View style={styles.revenueContainer}>
                <Text style={styles.revenueText}>Rs</Text>
                <Text style={styles.boxValue}>{data.totalAmountMonthly}</Text>
              </View>
            </View>
          </View>
          {/* Chart */}
          <View style={styles.chartContainer}>
            <View style={{width: '100%', marginBottom: 20}}>
              <Text style={{fontFamily: 'Space-Bold'}}>Weekly Earnings!</Text>
            </View>
            <View style={{height: 200, flexDirection: 'row'}}>
              <YAxis
                style={{marginBottom: 10}}
                data={data.weeklyEarnings}
                contentInset={{top: 20, bottom: 20}}
                svg={{
                  fill: 'grey',
                  fontSize: 10,
                  fontFamily: 'Space-Regular',
                }}
                numberOfTicks={6}
                formatLabel={value => `₹ ${value}`}
              />
              <View style={{flex: 1, marginLeft: 10}}>
                <LineChart
                  style={{flex: 1}}
                  data={data.weeklyEarnings}
                  svg={{stroke: 'gray', strokeWidth: 3}}
                  contentInset={{top: 20, bottom: 20}}
                  numberOfTicks={6}
                  curve={shape.curveNatural}>
                  <Grid />
                  {/* Add today's peak label */}
                  <G>
                    <SVGText
                      x={todayIndex * (250 / 6) + 2} // Adjust x position based on todayIndex
                      y={
                        200 -
                        (todayPeakValue / Math.max(...data.weeklyEarnings)) *
                          190
                      } // Adjust y position based on peak value
                      fontSize="10"
                      fontFamily="Space-Bold"
                      fill="gray"
                      alignmentBaseline="middle"
                      textAnchor="middle">
                      Today
                    </SVGText>
                  </G>
                </LineChart>
                <XAxis
                  style={{marginHorizontal: -10, height: 30, marginTop: 10}}
                  data={xData}
                  numberOfTicks={7}
                  formatLabel={(value, index) => xData[index]}
                  contentInset={{left: 10, right: 10}}
                  svg={{
                    fontSize: 10,
                    fill: 'grey',
                    fontFamily: 'Space-Regular',
                  }}
                />
              </View>
            </View>
          </View>
          {/* our branding */}
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 15,
            }}>
            <Text style={{fontFamily: 'Space-Bold', color: 'gray'}}>
              Made with 💗 by yk creates.
            </Text>
          </View>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#E3E3E3',
    fontFamily: 'Space-Medium',
    fontSize: 15,
  },
  restaurantName: {
    color: 'white',
    fontFamily: 'Space-Bold',
    fontSize: 20,
  },
  profilePic: {
    height: 40,
    backgroundColor: 'white',
    width: 40,
    borderRadius: 200,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 15,
    fontFamily: 'Space-Bold',
    marginTop: 10,
    color: '#729762',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
    margin: 10,
    marginTop: 15,
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
  boxValue: {
    fontSize: 35,
    fontFamily: 'Space-SemiBold',
    color: 'white',
  },
  revenueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },
  revenueText: {
    fontSize: 14,
    fontFamily: 'Space-SemiBold',
    color: 'white',
    marginBottom: 4,
  },
  chartContainer: {
    marginHorizontal: 15,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: '#fffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartLabel: {
    position: 'absolute',
    top: 40,
    left: 150,
    backgroundColor: '#E3E3E3',
    padding: 5,
    borderRadius: 5,
  },
  chartLabelText: {
    color: '#000',
    fontFamily: 'Space-Bold',
  },
});
