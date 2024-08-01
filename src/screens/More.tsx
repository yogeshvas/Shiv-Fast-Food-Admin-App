import {
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import useGetKitchenStatus from '../services/hooks/useGetKitchenStatus';
import useUpdateOrderStaus from '../services/hooks/useUpdateOrderStaus';
import useUpdateKitchenStatus from '../services/hooks/useUpdateKitchenStatus';

const More = ({navigation}: any) => {
  const {data, isLoading, refetch, isRefetching} = useGetKitchenStatus();
  const [modalVisible, setModalVisible] = useState(false);
  const {
    mutate: updateStatus,
    isPending,
    isError,
    error,
  } = useUpdateKitchenStatus();
  if (isLoading || isRefetching) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  const handleUpdateStatus = () => {
    let kitchenStatus;
    if (data?.open) {
      kitchenStatus = false;
    } else {
      kitchenStatus = true;
    }

    updateStatus(
      {kitchenStatus},
      {
        onSuccess: () => {
          // Toggle modal visibility and refetch data
          setModalVisible(!modalVisible);
          refetch();
        },
      },
    );
  };

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
            {data.open ? (
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
        <View>
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
        </View>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false); // Close modal on back button press (Android)
        }}>
        <View style={styles.centeredView}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1} // Disable default opacity behavior
            onPress={() => setModalVisible(false)} // Close modal on overlay press
          />
          <View style={styles.modalView}>
            {data?.status ? (
              <Text style={styles.modalText}>
                Do You want close the kitchen?
              </Text>
            ) : (
              <Text style={styles.modalText}>
                Do You want to open the Kitchen?
              </Text>
            )}

            {data?.open && (
              <TouchableOpacity
                style={[styles.button, {backgroundColor: '#FA7070'}]}
                onPress={handleUpdateStatus}>
                <Text style={styles.textStyle}>Close Kitchen</Text>
              </TouchableOpacity>
            )}
            {!data.open && (
              <TouchableOpacity
                style={[styles.button, {backgroundColor: '#597445'}]}
                onPress={handleUpdateStatus}>
                <Text style={[styles.textStyle, {fontFamily: 'Space-Bold'}]}>
                  Open Kitchen
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
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
