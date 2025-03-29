import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import types
import { Product } from '../types/schema';

// API URL
const API_URL = 'http://localhost:5000/api';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Temporary user ID for demo - in a real app, this would come from authentication
  const userId = 1;

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/favorites?userId=${userId}`);
      const data = await response.json();
      setFavorites(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setIsLoading(false);
    }
  };

  const removeFavorite = async (productId: number) => {
    try {
      await fetch(`${API_URL}/favorites/${productId}?userId=${userId}`, {
        method: 'DELETE',
      });
      // Update the UI
      setFavorites(favorites.filter(fav => fav.id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleSelectProduct = (product: Product) => {
    // @ts-ignore
    navigation.navigate('ARView', { product });
  };

  const renderFavoriteItem = ({ item }: { item: Product }) => (
    <View style={styles.favoriteCard}>
      <TouchableOpacity 
        style={styles.favoriteImageContainer}
        onPress={() => handleSelectProduct(item)}
      >
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.favoriteImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteBrand}>{item.brand}</Text>
        <Text style={styles.favoriteName}>{item.name}</Text>
        <Text style={styles.favoritePrice}>${item.price}</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.tryOnButton}
            onPress={() => handleSelectProduct(item)}
          >
            <Text style={styles.tryOnButtonText}>Try On</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFavorite(item.id)}
          >
            <Ionicons name="heart-dislike" size={16} color="#E87A5D" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Favorites</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3B5BA5" />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Tap the heart icon on any product to add it to favorites</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            // @ts-ignore
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.favoritesList}
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
  favoritesList: {
    padding: 15,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
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
  favoriteImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#f9f9f9',
  },
  favoriteImage: {
    width: '100%',
    height: '100%',
  },
  favoriteInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  favoriteBrand: {
    fontSize: 12,
    color: '#888',
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  favoritePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B5BA5',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  tryOnButton: {
    backgroundColor: '#3B5BA5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  tryOnButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
    backgroundColor: 'rgba(232, 122, 93, 0.1)',
    borderRadius: 20,
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
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#3B5BA5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default FavoritesScreen;