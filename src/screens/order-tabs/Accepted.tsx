import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const {width} = Dimensions.get('window');

const Active = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [acceptingOrders, setAcceptingOrders] = useState(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        'https://shiv-phi.vercel.app/api/orders/accepted',
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleAcceptOrder = async orderId => {
    setAcceptingOrders(prev => new Set([...prev, orderId]));
    try {
      const response = await axios.put(
        'https://shiv-phi.vercel.app/api/orders',
        {
          id: orderId,
          status: 'DELIVERED',
        },
      );

      if (response.status === 200) {
        setOrders(prevOrders =>
          prevOrders.filter(order => order._id !== orderId),
        );
      }
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setAcceptingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const formatTimeAgo = dateString => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInHours = Math.floor((now - orderDate) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `about ${diffInHours} hours ago`;
    } else {
      return orderDate.toLocaleDateString();
    }
  };

  const renderOrderItem = ({item}) => {
    const isExpanded = expandedOrder === item._id;
    const isAccepting = acceptingOrders.has(item._id);
    const categories = [...new Set(item.item.map(i => i.food.category))].join(
      ', ',
    );

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => setExpandedOrder(isExpanded ? null : item._id)}>
          <View>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.categoryText}>{categories}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Text style={styles.timeText}>{formatTimeAgo(item.createdAt)}</Text>
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.totalAmount}>₹ {item.totalAmount}/-</Text>
            {!isExpanded ? (
              <Image
                style={{height: 16, width: 16}}
                source={require('./../../assets/images/down.png')}
              />
            ) : (
              <Image
                style={{
                  height: 16,
                  width: 16,
                  transform: [{rotate: '180deg'}],
                }}
                source={require('./../../assets/images/down.png')}
              />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Item Details</Text>
              {item.item.map((orderItem, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <View style={styles.rankContainer}>
                      <Text style={styles.itemCount}>
                        ×{orderItem.quantity}
                      </Text>
                    </View>
                    <Text style={styles.itemName}>{orderItem.food.name}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    ₹{orderItem.food.price * orderItem.quantity}/-
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <Text style={styles.sectionContent}>{item.customerAddress}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phone Number</Text>
              <Text style={styles.sectionContent}>{item.customerPhone}</Text>
            </View>

            {item.customization && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customization</Text>
                <Text style={styles.sectionContent}>{item.customization}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.deliverButton,
                isAccepting && styles.deliverButtonDisabled,
              ]}
              onPress={() => handleAcceptOrder(item._id)}
              disabled={isAccepting}>
              {isAccepting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text
                    style={[
                      styles.deliverButtonText,
                      styles.loadingButtonText,
                    ]}>
                    Accepting...
                  </Text>
                </View>
              ) : (
                <Text style={styles.deliverButtonText}>Deliver Order</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#597445" size="large" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }
  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No orders available</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.scrollView}
        contentContainerStyle={styles.listContainer}
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#597445']}
            tintColor="#597445"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Base container styles remain the same
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Space-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#597445',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  refreshButtonText: {
    color: 'white',
    fontFamily: 'Space-Bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 8,
    color: '#597445',
    fontFamily: 'Space-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#696969',
  },
  orderHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontFamily: 'Space-Bold',
    fontSize: 18, // Restored to original size
    color: '#333',
    marginBottom: 4,
  },
  categoryText: {
    fontFamily: 'Space-SemiBold',
    fontSize: 14, // Restored to original size
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: '#F0F7ED',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    color: '#597445',
    fontSize: 12, // Restored to original size
    fontFamily: 'Space-SemiBold',
  },
  timeText: {
    fontSize: 12, // Restored to original size
    color: '#666',
    fontFamily: 'Space-SemiBold',
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontFamily: 'Space-Bold',
    fontSize: 20, // Restored to original size
    color: '#597445',
    marginBottom: 8,
  },
  expandedContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Space-Bold',
    fontSize: 18, // Restored to original size
    color: '#333',
    marginBottom: 12,
  },
  sectionContent: {
    fontFamily: 'Space-SemiBold',
    fontSize: 14, // Restored to original size
    color: '#666',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    width: 30, // Restored to original size
    height: 30, // Restored to original size
    borderRadius: 15,
    backgroundColor: '#F0F7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemCount: {
    fontFamily: 'Space-Bold',
    fontSize: 14, // Restored to original size
    color: '#597445',
  },
  itemName: {
    fontFamily: 'Space-SemiBold',
    fontSize: 14, // Restored to original size
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontFamily: 'Space-Bold',
    fontSize: 14, // Restored to original size
    color: '#597445',
  },
  deliverButton: {
    backgroundColor: '#597445',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  deliverButtonDisabled: {
    backgroundColor: '#597445',
    opacity: 0.7,
  },
  deliverButtonText: {
    color: 'white',
    fontSize: 16, // Restored to original size
    fontFamily: 'Space-Bold',
  },
  loadingButtonText: {
    marginLeft: 8,
  },
});

export default Active;
