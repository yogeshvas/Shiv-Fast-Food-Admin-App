import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
const MenuManagement = ({navigation}: any) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null); // Track the currently editing item
  const [editingPrice, setEditingPrice] = useState(''); // Track the edited price
  const [updating, setUpdating] = useState({}); // Track updating state for specific items

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('https://shiv-ff.vercel.app/api/food');
      if (response.data.success) {
        setFoodItems(response.data.foodItems);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      Alert.alert('Error', 'Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const updateFoodItem = async (id, updates) => {
    try {
      setUpdating(prev => ({...prev, [id]: true})); // Set updating state for the specific item
      await axios.put('https://shiv-ff.vercel.app/api/food', {
        id,
        ...updates,
      });
      ToastAndroid.show('Food item updated successfully', ToastAndroid.SHORT);
      await fetchFoodItems();
    } catch (error) {
      console.error('Error updating food item:', error);
      Alert.alert('Error', 'Failed to update food item');
    } finally {
      setUpdating(prev => ({...prev, [id]: false})); // Reset updating state for the specific item
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#597445" />
      </View>
    );
  }

  const renderFoodItem = item => {
    const isEditing = editingItem === item._id;
    const isUpdating = updating[item._id] || false; // Check updating state for the specific item

    return (
      <View key={item._id} style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity
            style={[
              styles.vegStatus,
              {backgroundColor: item.isNonVeg ? '#ff6b6b' : '#51cf66'},
            ]}
            onPress={() =>
              updateFoodItem(item._id, {isNonVeg: !item.isNonVeg})
            }>
            <Text style={styles.vegStatusText}>
              {item.isNonVeg ? 'Non-Veg' : 'Veg'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.priceContainer}>
            <Text style={styles.label}>Price (Rs)</Text>
            <TextInput
              style={styles.priceInput}
              value={isEditing ? editingPrice : String(item.price)}
              keyboardType="numeric"
              onChangeText={text => {
                if (isEditing) setEditingPrice(text);
              }}
              onFocus={() => {
                setEditingItem(item._id);
                setEditingPrice(String(item.price)); // Set initial value when editing starts
              }}
              onEndEditing={() => {
                const newPrice = parseInt(editingPrice);
                if (
                  !isNaN(newPrice) &&
                  newPrice > 0 &&
                  newPrice !== item.price
                ) {
                  updateFoodItem(item._id, {price: newPrice});
                }
                setEditingItem(null); // Reset editing state
              }}
            />
          </View>

          <View style={styles.availabilityContainer}>
            <Text style={styles.label}>Out of Stock</Text>
            <TouchableOpacity
              style={[
                styles.availabilityButton,
                {
                  backgroundColor: item.availability ? '#e9ecef' : '#adb5bd',
                },
              ]}
              onPress={() =>
                updateFoodItem(item._id, {availability: !item.availability})
              }>
              <Text style={styles.checkmark}>✓</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() =>
            updateFoodItem(item._id, {
              price: item.price,
              availability: item.availability,
              isNonVeg: item.isNonVeg,
            })
          }
          disabled={isUpdating}>
          <Text style={styles.updateButtonText}>
            {isUpdating ? 'Updating...' : 'Update'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={{height: 15, width: 15, marginLeft: 10}}
            source={require('../assets/images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Management</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search item"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView style={styles.itemsList}>
        {filteredItems.map(renderFoodItem)}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  // Keep the same styles as provided.
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: '#597445',
    padding: 10,
    gap: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Space-Bold',
    color: 'white',
    fontSize: 17,
    marginLeft: 10,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Space-Regular',
  },
  itemsList: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemName: {
    fontFamily: 'Space-Bold',
    fontSize: 16,
    color: 'black',
  },
  vegStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  vegStatusText: {
    color: 'white',
    fontFamily: 'Space-SemiBold',
    fontSize: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceContainer: {
    flex: 1,
  },
  label: {
    fontFamily: 'Space-Regular',
    color: '#666',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 8,
    fontFamily: 'Space-Regular',
  },
  availabilityContainer: {
    flex: 1,
    alignItems: 'center',
  },
  availabilityButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#597445',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontFamily: 'Space-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuManagement;
