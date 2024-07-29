import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import MenuCards from '../components/MenuCards';
import useGetMenu from '../services/hooks/useGetMenu';

const MenuManagement = ({navigation}: any) => {
  const {data, refetch} = useGetMenu();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // Filter the menu items based on the search query
  const filteredData = data?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderMenuCard = ({item}: any) => (
    <MenuCards data={item} refetch={refetch} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={{width: 17, height: 20}}
            source={require('../assets/images/back.png')}
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>Menu Management</Text>
      </View>
      <View style={styles.searchContainer}>
        <Image
          source={require('../assets/images/search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="search item"
          placeholderTextColor={'gray'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* cards */}
      <FlatList
        data={filteredData}
        renderItem={renderMenuCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.flatListContentContainer}
        style={styles.flatList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default MenuManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 70,
    backgroundColor: '#597445',
    paddingHorizontal: 20,
    gap: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'Space-Bold',
    color: 'white',
    fontSize: 17,
    marginLeft: 10,
  },
  searchContainer: {
    margin: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'gray',
    gap: 4,
  },
  searchIcon: {
    width: 15,
    height: 15,
    opacity: 0.5,
  },
  searchInput: {
    fontFamily: 'Space-Regular',
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  flatListContentContainer: {
    paddingBottom: 20,
  },
});
