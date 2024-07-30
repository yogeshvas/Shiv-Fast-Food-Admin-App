import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import useUpdateMenu from '../services/hooks/useUpdateMenu';

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const MenuCards = ({data, refetch}: any) => {
  const [price, setPrice] = useState(String(data.price));
  const [availability, setAvailability] = useState(data.availability);
  const [hasChanges, setHasChanges] = useState(false);
  const updateMenu = useUpdateMenu();

  useEffect(() => {
    setHasChanges(
      price !== String(data.price) || availability !== data.availability,
    );
  }, [price, availability, data.price, data.availability]);

  const handlePriceChange = (newPrice: string) => {
    setPrice(newPrice);
  };

  const toggleAvailability = () => {
    setAvailability(prev => !prev);
  };

  const handleUpdate = () => {
    updateMenu.mutate({id: data._id, price, availability});
    refetch();
  };

  return (
    <View
      style={{
        borderLeftWidth: 10,
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderLeftColor: data.nonVeg ? '#FA7070' : '#87A96E',
        borderWidth: 1,
        borderRightWidth: 0,
        marginBottom: 10,
      }}>
      {/* @row 1 */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {/* name */}
        <View style={{width: '50%'}}>
          <Text
            style={{fontFamily: 'Space-Regular', color: 'gray', fontSize: 12}}>
            Name
          </Text>
        </View>
        {/* price */}
        <View style={{width: '25%'}}>
          <Text
            style={{fontFamily: 'Space-Regular', color: 'gray', fontSize: 12}}>
            Price {`(Rs)`}
          </Text>
        </View>

        {/* availability */}
        <View style={{width: '25%'}}>
          <Text
            style={{fontFamily: 'Space-Regular', color: 'gray', fontSize: 12}}>
            Out of Stock
          </Text>
        </View>
      </View>
      {/* @row 2 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        {/* name */}
        <View style={{width: '50%'}}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Space-Bold',
              width: '70%',
              color: 'black',
            }}>
            {capitalizeFirstLetter(data.name)}
          </Text>
        </View>
        {/* price */}
        <View style={{width: '25%'}}>
          <TextInput
            value={price}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: '80%',
              color: 'black',
              borderColor: 'gray',
              paddingHorizontal: 10,
            }}
          />
        </View>

        {/* availability */}
        <View
          style={{
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={toggleAvailability}>
            {availability ? (
              <Image
                style={{width: 20, height: 20, opacity: 0.5}}
                source={require('../assets/images/square-black.png')}
              />
            ) : (
              <Image
                style={{width: 20, height: 20}}
                source={require('../assets/images/square.png')}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleUpdate}
        style={[styles.updateButton, !hasChanges && {backgroundColor: 'gray'}]}
        disabled={!hasChanges}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuCards;

const styles = StyleSheet.create({
  updateButton: {
    marginTop: 10,
    backgroundColor: '#87A96E',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontFamily: 'Space-Bold',
  },
});
