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
} from 'react-native';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OrderAccordian = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    // Optional: Uncomment the following line to enable layout animation
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setIsOpen(!isOpen);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleAccordion}>
        <View style={[styles.card, isOpen && styles.open]}>
          <View>
            <View style={{flexDirection: 'row'}}>
              {/* closed accordian */}
              {!isOpen && (
                <View
                  style={{
                    width: '5%',
                    height: 120,
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    borderRightWidth: 1,

                    backgroundColor: '#87A96E',
                  }}></View>
              )}
              {/* row 1 */}

              <View>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    {/* order */}
                    {/* leftmost */}

                    <View
                      style={{
                        flexDirection: 'row',
                        width: isOpen ? '20%' : '15%',
                        height: 66,
                        margin: 10,
                        paddingRight: 2,
                        borderWidth: isOpen ? 2 : 0,
                        borderRightWidth: isOpen ? 2 : 1,
                        borderRadius: isOpen ? 4 : 0,
                        borderColor: isOpen ? '#87A96E' : 'gray',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          paddingRight: 8,
                        }}>
                        <Text
                          style={{
                            color: isOpen ? '#87A96E' : 'black',
                            fontFamily: 'Space-Bold',
                          }}>
                          Order
                        </Text>
                        <Text
                          style={{
                            color: isOpen ? '#87A96E' : 'black',
                            fontFamily: 'Space-Medium',
                            fontSize: 20,
                          }}>
                          17
                        </Text>
                      </View>
                    </View>

                    {/* right */}
                    <View
                      style={{
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'stretch',

                        width: '75%',
                      }}>
                      <View>
                        <Text
                          style={{
                            color: 'black',
                            fontFamily: 'Space-SemiBold',
                            fontSize: 16,
                          }}>
                          Yogesh Vashisth
                        </Text>
                        <Text
                          style={{color: 'gray', fontFamily: 'Space-Medium'}}>
                          Rolls, Chaap
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row', gap: 10}}>
                        <Image
                          style={{width: 20, height: 20}}
                          source={require('../assets/images/more-black.png')}
                        />
                        <Image
                          style={{width: 20, height: 20}}
                          source={require('../assets/images/down.png')}
                        />
                      </View>
                    </View>
                    {/* icons */}
                  </View>
                </View>
                {/* row 2 */}
                <View>
                  <Text>hi</Text>
                </View>
              </View>
            </View>
            {isOpen && (
              <View style={styles.content}>
                <Text>This is the content of the accordion.</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    // padding: 12,
    margin: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  open: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    marginTop: 8,
  },
});

export default OrderAccordian;
