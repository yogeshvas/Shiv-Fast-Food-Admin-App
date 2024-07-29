import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  Linking,
} from 'react-native';
import moment from 'moment';
import useUpdateOrderStaus from '../services/hooks/useUpdateOrderStaus';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OrderAccordion = ({data, refetch}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    mutate: changeStatus,
    isPending,
    isError,
    error,
  } = useUpdateOrderStaus();

  const capitalizeFirstLetter = string => {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const toggleAccordion = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const handleUpdateStatus = () => {
    let newStatus;

    if (data.status === 'PLACED') {
      newStatus = 'ACCEPTED';
    } else if (data.status === 'ACCEPTED') {
      newStatus = 'DELIVERED';
    } else {
      // Handle other statuses if needed
      return; // Exit early if no matching status
    }

    changeStatus(
      {orderId: data._id, status: newStatus},
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:+91${data?.customerPhoneNo}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={toggleAccordion}>
        <View style={styles.indicator} />
        <View style={[styles.card, isOpen && styles.open]}>
          <View style={styles.header}>
            <View style={[styles.orderInfo]}>
              <Text style={[styles.orderText]}>Order</Text>
              <Text style={[styles.orderNumber]}>17</Text>
            </View>
            <View style={styles.customerInfo}>
              <View>
                <Text style={styles.customerName}>{data?.customerName}</Text>
                {isOpen ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.timeLabel}>Time</Text>
                      <Text style={styles.timeValue}>
                        {moment(data?.createdAt).format('hh:mm a')}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.statusLabel}>Status : </Text>
                      <Text
                        style={[
                          styles.statusValue,
                          {
                            color:
                              data?.status === 'DELIVERED'
                                ? '#87A96E'
                                : '#596FB7',
                          },
                        ]}>
                        {data?.status}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{flexDirection: 'row', gap: 5}}>
                      {data?.items?.slice(0, 2).map((food, index) => (
                        <Text key={index} style={styles.orderDetails}>
                          {capitalizeFirstLetter(food?.foodItem?.name)}
                        </Text>
                      ))}
                      {data?.items?.length > 2 && (
                        <Text style={styles.orderDetails}>...</Text>
                      )}
                    </View>
                  </>
                )}
              </View>
              <View style={styles.icons}>
                {/* open modal */}
                <TouchableOpacity>
                  <Image
                    style={styles.iconRotate}
                    source={require('../assets/images/more-black.png')}
                  />
                </TouchableOpacity>
                <Image
                  style={[
                    styles.icon,
                    {transform: [{rotate: isOpen ? '180deg' : '0deg'}]},
                  ]}
                  source={require('../assets/images/down.png')}
                />
              </View>
            </View>
          </View>

          {!isOpen && (
            <>
              <View style={styles.separator} />
              <View style={styles.timeContainer}>
                <View style={styles.statusSection}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.timeLabel}>Time</Text>
                    <Text style={styles.timeValue}>
                      {moment(data?.createdAt).format('hh:mm A')}
                    </Text>
                  </View>
                </View>
                <View style={styles.timeDetails}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',

                      borderColor: 'gray',

                      gap: 10,
                    }}>
                    <Text style={styles.statusLabel}>Status : </Text>
                    <Text
                      style={[
                        styles.statusValue,
                        {
                          color:
                            data?.status === 'DELIVERED'
                              ? '#87A96E'
                              : '#596FB7',
                        },
                      ]}>
                      {data?.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.timeDetails}>
                  <View style={styles.amountSection}>
                    <Text style={styles.amountLabel}>Amount</Text>
                    <Text style={styles.amountValue}>
                      Rs {data?.totalAmount} /-
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {isOpen && (
            <View style={styles.content}>
              {/* order */}
              {/* row */}
              {/* items */}
              <View>
                {data?.items.map(food => (
                  <View
                    key={food._id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 40,
                      paddingTop: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      {food.foodItem.nonVeg ? (
                        <Image
                          style={{width: 20, height: 20}}
                          source={require('../assets/images/non.png')}
                        />
                      ) : (
                        <Image
                          style={{width: 20, height: 20}}
                          source={require('../assets/images/veg.png')}
                        />
                      )}
                      <Text style={{fontFamily: 'Space-Bold', color: 'black'}}>
                        {capitalizeFirstLetter(food.foodItem.name)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        // justifyContent: 'space-between',
                        gap: 50,
                      }}>
                      <Text style={{fontFamily: 'Space-Bold', color: 'black'}}>
                        x{food.quantity}
                      </Text>
                      <Text style={{fontFamily: 'Space-Bold', color: 'black'}}>
                        Rs {food.foodItem.price} /-
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              {/* total price */}
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor: '#DCE1F0',
                  margin: 10,
                  borderRadius: 4,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'black', fontFamily: 'Space-Bold'}}>
                    Total Price
                  </Text>
                  <Text
                    style={{
                      color: '#596FB7',
                      fontFamily: 'Space-Bold',
                      fontSize: 16,
                    }}>
                    Rs {data?.totalAmount} /-
                  </Text>
                </View>
              </View>
              {/* phone no */}
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: 'gray',
                  marginTop: 5,
                  paddingTop: 10,
                  paddingHorizontal: 20,
                }}>
                <View>
                  <Text style={{fontFamily: 'Space-Bold', color: 'gray'}}>
                    Phone :
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      gap: 5,
                      alignItems: 'center',
                    }}
                    onPress={handlePhonePress}>
                    <Text
                      style={{
                        fontFamily: 'Space-Bold',
                        color: '#596FB7',
                        fontSize: 16,
                      }}>
                      {data?.customerPhoneNo}
                    </Text>
                    <Image
                      style={{height: 15, width: 15}}
                      source={require('../assets/images/maximize.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* address */}

              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: 'gray',
                  marginTop: 5,
                  paddingTop: 10,
                  paddingHorizontal: 20,
                }}>
                <View>
                  <Text style={{fontFamily: 'Space-Bold', color: 'gray'}}>
                    Address :
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Space-Bold',
                      color: 'black',
                      fontSize: 16,
                    }}>
                    {data?.customerAddress}
                  </Text>
                </View>
              </View>

              {/* button */}
              <View>
                <TouchableOpacity
                  onPress={handleUpdateStatus}
                  disabled={data?.status === 'DELIVERED'} // Check for exact match
                  style={{
                    backgroundColor:
                      data?.status === 'DELIVERED' ? 'gray' : '#597445',
                    margin: 10,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                  }}>
                  {data?.status === 'PLACED' && (
                    <Text
                      style={{
                        fontFamily: 'Space-Bold',
                        color: 'white',
                      }}>
                      Accept Order
                    </Text>
                  )}
                  {data?.status === 'ACCEPTED' && (
                    <Text
                      style={{
                        fontFamily: 'Space-Bold',
                        color: 'white',
                      }}>
                      Deliver Order
                    </Text>
                  )}
                  {data?.status === 'DELIVERED' && (
                    <Text
                      style={{
                        fontFamily: 'Space-Bold',
                        color: 'white',
                      }}>
                      Delivered
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
  },
  touchable: {
    flexDirection: 'row',
  },
  indicator: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#87A96E',
    width: 10,
    borderRightWidth: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
  },
  open: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    padding: 10,
  },
  orderInfo: {
    borderWidth: 1,
    borderRightWidth: 1,
    borderRadius: 4,
    padding: 10,
    width: '20%',
    alignItems: 'center',
    borderColor: 'gray',
  },
  orderInfoOpen: {
    borderColor: '#87A96E',
    borderWidth: 1,
  },
  orderText: {
    fontFamily: 'Space-Bold',
    color: 'black',
  },
  orderTextOpen: {
    color: '#87A96E',
  },
  orderNumber: {
    fontFamily: 'Space-Medium',
    fontSize: 20,
    color: 'black',
  },
  orderNumberOpen: {
    color: '#87A96E',
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 10,
  },
  customerName: {
    fontFamily: 'Space-SemiBold',
    fontSize: 16,
    color: 'black',
  },
  orderDetails: {
    fontFamily: 'Space-Medium',
    color: 'gray',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRotate: {
    width: 15,
    height: 15,
    transform: [{rotate: '90deg'}],
    marginRight: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  separator: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: 'gray',
    marginTop: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  timeCard: {
    width: '20%',
    alignItems: 'center',
  },
  timeSection: {
    // borderRightWidth: 1,
    borderColor: 'gray',
    paddingRight: 10,
  },
  timeLabel: {
    fontFamily: 'Space-Medium',
    fontSize: 10,
    color: 'gray ',
  },
  timeValue: {
    fontFamily: 'Space-Bold',
    fontSize: 12,
    color: 'black',
    marginLeft: 10,
  },
  timeDetails: {
    width: '40%',
    paddingHorizontal: 10,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'gray',
    paddingRight: 10,
    gap: 10,
  },
  statusLabel: {
    fontFamily: 'Space-Regular',
    fontSize: 10,
    color: 'black',
  },
  statusValue: {
    fontFamily: 'Space-Bold',
    color: '#596FB7',
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    gap: 10,
  },
  amountLabel: {
    fontFamily: 'Space-Regular',
    fontSize: 10,
    color: 'black',
  },
  amountValue: {
    fontFamily: 'Space-Bold',
    color: '#508D4E',
  },
  content: {
    // padding: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderColor: 'gray',
  },
});

export default OrderAccordion;
