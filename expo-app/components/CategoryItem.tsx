import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { Category } from '../types/schema';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onPress: (categoryId: number) => void;
}

const CategoryItem = ({ category, isSelected, onPress }: CategoryItemProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={() => onPress(category.id)}
    >
      <Text 
        style={[
          styles.text,
          isSelected && styles.selectedText
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  selectedContainer: {
    backgroundColor: '#3B5BA5',
  },
  text: {
    color: '#333',
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
});

export default CategoryItem;