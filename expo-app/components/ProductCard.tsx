import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Product } from '../types/schema';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  compact?: boolean;
}

const ProductCard = ({ product, onPress, compact = false }: ProductCardProps) => {
  return (
    <TouchableOpacity 
      style={[styles.card, compact && styles.compactCard]}
      onPress={() => onPress(product)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.imageUrl }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onPress(product)}
        >
          <Text style={styles.buttonText}>Try On</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: 160,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  compactCard: {
    width: 140,
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '90%',
    height: '90%',
  },
  infoContainer: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    color: '#888',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B5BA5',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3B5BA5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default ProductCard;