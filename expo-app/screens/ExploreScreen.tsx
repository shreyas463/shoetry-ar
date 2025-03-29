import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import types
import { Product } from '../types/schema';

// API URL
const API_URL = 'http://localhost:5000/api';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    // @ts-ignore
    navigation.navigate('ARView', { product });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleSelectProduct(item)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity 
          style={styles.tryOnButton}
          onPress={() => handleSelectProduct(item)}
        >
          <Text style={styles.tryOnButtonText}>Try On</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for shoes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3B5BA5" />
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No shoes found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.productGrid}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  productGrid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f9f9f9',
  },
  productInfo: {
    padding: 12,
  },
  productBrand: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B5BA5',
    marginBottom: 8,
  },
  tryOnButton: {
    backgroundColor: '#3B5BA5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  tryOnButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default ExploreScreen;