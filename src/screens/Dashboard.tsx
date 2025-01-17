import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

const {width} = Dimensions.get('window');

// Define interfaces for our data types
interface PopularDish {
  _id: string;
  name: string;
  orderCount: number;
}

interface DashboardData {
  pendingOrders: number;
  acceptedOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
  popularDishes: PopularDish[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('https://shiv-phi.vercel.app/api/dashboard');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData: DashboardData = await response.json();
      setData(jsonData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDashboardData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#597445" size="large" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.cardShadow]}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardValue}>{data?.pendingOrders}</Text>
              <Text style={styles.cardLabel}>Pending Orders</Text>
            </View>
          </View>

          <View style={[styles.summaryCard, styles.cardShadow]}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardValue}>{data?.acceptedOrders}</Text>
              <Text style={styles.cardLabel}>Accepted Orders</Text>
            </View>
          </View>
        </View>

        {/* Revenue Section */}
        <View style={[styles.revenueContainer]}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.revenueCards}>
            <View style={styles.revenueCard}>
              <Text style={styles.revenueLabel}>Today's Revenue</Text>
              <Text style={styles.revenueValue}>₹{data?.todayRevenue}</Text>
            </View>
            <View style={styles.revenueDivider} />
            <View style={styles.revenueCard}>
              <Text style={styles.revenueLabel}>Monthly Revenue</Text>
              <Text style={styles.revenueValue}>₹{data?.monthlyRevenue}</Text>
            </View>
          </View>
        </View>

        {/* Popular Dishes */}
        <View style={[styles.popularDishesContainer]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Dishes</Text>
          </View>
          {data?.popularDishes.map((dish, index) => (
            <View key={dish._id} style={styles.dishItem}>
              <View style={styles.dishInfo}>
                <View style={styles.rankContainer}>
                  <Text style={styles.dishRank}>#{index + 1}</Text>
                </View>
                <Text style={styles.dishName}>{dish.name}</Text>
              </View>
              <View
                style={[styles.orderCount, index < 3 ? styles.topThree : null]}>
                <Text style={styles.orderCountText}>
                  {dish.orderCount} orders
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{height: 10}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#597445',
    fontFamily: 'Space-SemiBold',
  },
  errorText: {
    color: 'red',
    fontFamily: 'Space-Bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  header: {
    height: 90,
    backgroundColor: '#597445',
    padding: 15,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontFamily: 'Space-Bold',
    color: 'white',
    fontSize: 24,
    marginLeft: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  dateText: {
    color: 'white',
    fontFamily: 'Space-SemiBold',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    width: (width - 40) / 2,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#696969',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardValue: {
    fontFamily: 'Space-Bold',
    fontSize: 24,
    color: '#597445',
    marginBottom: 4,
  },
  cardLabel: {
    fontFamily: 'Space-SemiBold',
    fontSize: 12,
    color: '#666',
  },
  revenueContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#696969',
    marginBottom: 20,
  },
  revenueCards: {
    flexDirection: 'row',
    marginTop: 15,
  },
  revenueCard: {
    flex: 1,
    alignItems: 'center',
  },
  revenueDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 15,
  },
  revenueLabel: {
    fontFamily: 'Space-SemiBold',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  revenueValue: {
    fontFamily: 'Space-Bold',
    fontSize: 20,
    color: '#597445',
  },
  popularDishesContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#696969',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Space-Bold',
    fontSize: 18,
    color: '#333',
  },
  dishItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dishInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dishRank: {
    fontFamily: 'Space-Bold',
    fontSize: 14,
    color: '#597445',
  },
  dishName: {
    fontFamily: 'Space-SemiBold',
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  orderCount: {
    backgroundColor: '#F0F7ED',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topThree: {
    backgroundColor: '#b2cd9e',
  },
  orderCountText: {
    fontFamily: 'Space-SemiBold',
    color: '#597445',
    fontSize: 12,
  },
  cardShadow: {
    // Shadow styles if needed
  },
});

export default Dashboard;
