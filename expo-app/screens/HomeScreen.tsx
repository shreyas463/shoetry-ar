import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import types and components
import { Product, Category } from '../types/schema';
import ProductCard from '../components/ProductCard';
import CategoryItem from '../components/CategoryItem';
import FeatureBanner from '../components/FeatureBanner';

// Import API utilities
import { getProducts, getCategories, getFeaturedProducts } from '../utils/api';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      fetchProductsByCategory(selectedCategory);
    } else {
      setCategoryProducts([]);
    }
  }, [selectedCategory]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Use the API utility functions
      const [categoriesData, featuredData] = await Promise.all([
        getCategories(),
        getFeaturedProducts()
      ]);
      
      setCategories(categoriesData);
      setFeaturedProducts(featuredData.slice(0, 5)); // Get first 5 as featured
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setIsLoading(false);
      
      // Set empty arrays in case of error
      setCategories([]);
      setFeaturedProducts([]);
    }
  };

  const fetchProductsByCategory = async (categoryId: number) => {
    try {
      // Use the API utility function
      const products = await getProducts(categoryId);
      setCategoryProducts(products);
    } catch (error) {
      console.error('Error fetching products for category:', error);
      setCategoryProducts([]);
    }
  };

  const handleSelectProduct = (product: Product) => {
    // @ts-ignore
    navigation.navigate('ARView', { product });
  };

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryItem
      category={item}
      isSelected={selectedCategory === item.id}
      onPress={handleCategoryPress}
    />
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={handleSelectProduct}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B5BA5" />
        <Text style={styles.loadingText}>Loading incredible shoes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey there,</Text>
            <Text style={styles.title}>Find your perfect fit</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="#3B5BA5" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search for shoes...</Text>
        </View>
        
        <FeatureBanner
          title="Try Before You Buy"
          subtitle="Use AR technology to see how shoes look on your feet"
          buttonText="Learn More"
          imageUrl={featuredProducts[0]?.imageUrl}
          onPress={() => console.log('Learn more about AR')}
        />
        
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        {selectedCategory ? (
          <View style={styles.categoryProductsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {categories.find(c => c.id === selectedCategory)?.name} Shoes
              </Text>
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.viewAllText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {categoryProducts.length > 0 ? (
              <FlatList
                horizontal
                data={categoryProducts}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <ActivityIndicator size="small" color="#3B5BA5" />
                <Text style={styles.emptyStateText}>Loading shoes...</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.featuredProductsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Shoes</Text>
              <TouchableOpacity 
                // @ts-ignore
                onPress={() => navigation.navigate('Explore')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={featuredProducts}
              renderItem={renderProductItem}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          </View>
        )}
        
        <View style={styles.recentlyViewedContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyStateContainer}>
            <Ionicons name="eye-outline" size={24} color="#ccc" />
            <Text style={styles.emptyStateText}>No recently viewed shoes</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 46,
    borderRadius: 23,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#999',
    fontSize: 14,
  },
  featuredBanner: {
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    padding: 20,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  bannerImageContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: 100,
    height: 100,
    transform: [{ rotate: '15deg' }],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#3B5BA5',
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryItem: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryItemSelected: {
    backgroundColor: '#3B5BA5',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: 'white',
  },
  featuredProductsContainer: {
    marginBottom: 20,
  },
  categoryProductsContainer: {
    marginBottom: 20,
  },
  productsList: {
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 10,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: 160,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImageContainer: {
    height: 120,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  productInfo: {
    padding: 12,
  },
  productBrand: {
    fontSize: 12,
    color: '#888',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B5BA5',
    marginBottom: 10,
  },
  tryOnButton: {
    backgroundColor: '#3B5BA5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  tryOnButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  recentlyViewedContainer: {
    marginBottom: 30,
  },
  emptyStateContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyStateText: {
    color: '#999',
    marginTop: 10,
    fontSize: 14,
  },
});

export default HomeScreen;