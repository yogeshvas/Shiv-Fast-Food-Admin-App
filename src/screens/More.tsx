import {
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const More = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [kitchenData, setKitchenData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchKitchenStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://shiv-ff.vercel.app/api/kitchen',
      );
      setKitchenData({open: response.data.isOpen});
    } catch (error) {
      console.error('Error fetching kitchen status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdateLoading(true);
      const newStatus = !kitchenData?.open;

      await axios.put('https://shiv-phi.vercel.app/api/kitchen', {
        status: newStatus,
      });

      // Refetch the kitchen status after update
      await fetchKitchenStatus();
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating kitchen status:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          height: 70,
          backgroundColor: '#597445',
          padding: 10,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Space-Bold',
            color: 'white',
            fontSize: 17,
            marginLeft: 10,
          }}>
          More
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View
            style={{
              backgroundColor: 'white',
              margin: 20,
              borderWidth: 1,
              padding: 20,
              borderColor: 'black',
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image
                resizeMode="contain"
                style={{width: 20, height: 20}}
                source={require('../assets/images/clock.png')}
              />
              <Text style={{fontFamily: 'Space-Bold', color: 'black'}}>
                Restaurant
              </Text>
            </View>
            {kitchenData?.open ? (
              <View
                style={{
                  backgroundColor: '#b2cd9e',
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Space-SemiBold',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}>
                  opened
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: '#ef8d8d',
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Space-SemiBold',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}>
                  closed
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('menu-management')}>
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 20,
            borderWidth: 1,
            padding: 25,
            borderColor: 'black',
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Image
              resizeMode="contain"
              style={{width: 15, height: 20}}
              source={require('../assets/images/menu.png')}
            />
            <Text style={{fontFamily: 'Space-Bold', color: 'black'}}>
              Menu Management
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Do you want to {kitchenData?.open ? 'close' : 'open'} the kitchen?
            </Text>
            {updateLoading ? (
              <ActivityIndicator color="#597445" />
            ) : (
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: kitchenData?.open ? '#FA7070' : '#597445'},
                ]}
                onPress={handleUpdateStatus}>
                <Text style={styles.textStyle}>
                  {kitchenData?.open ? 'Close Kitchen' : 'Open Kitchen'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Space-Bold',
    textAlign: 'center',
  },
  modalText: {
    color: 'black',
    marginBottom: 15,
    fontFamily: 'Space-Bold',
    textAlign: 'center',
  },
});

export default More;
