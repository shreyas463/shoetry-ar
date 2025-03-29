import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/schema';

interface AREffectsPanelProps {
  product: Product;
  visible: boolean;
  onClose: () => void;
  onSelectEffect: (effectName: string | null) => void;
  onColorChange: (colorHex: string) => void;
}

// Available effects for the AR visualization with optimized memory usage
const AVAILABLE_EFFECTS = [
  { id: 'sparkle', name: 'Sparkle', icon: 'sparkles-outline' },
  { id: 'neon', name: 'Neon Glow', icon: 'flashlight-outline' },
  { id: 'rainbow', name: 'Rainbow', icon: 'color-palette-outline' },
  { id: 'rotate_360', name: 'Rotate 360°', icon: 'sync-outline' },
  { id: 'size_comparison', name: 'Size Compare', icon: 'resize-outline' },
  { id: 'x_ray_view', name: 'X-Ray', icon: 'scan-outline' },
];

// Available colorways for the shoe with optimized memory usage
const AVAILABLE_COLORS = [
  { id: 'original', name: 'Original', hex: '#3B5BA5' }, // Prussian blue
  { id: 'red', name: 'Red', hex: '#E87A5D' }, // Orange accent
  { id: 'yellow', name: 'Yellow', hex: '#F3B941' }, // Mustard
  { id: 'black', name: 'Black', hex: '#333333' },
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'green', name: 'Green', hex: '#4CAF50' },
  { id: 'purple', name: 'Purple', hex: '#9C27B0' },
];

// Optimized AREffectsPanel with React.memo for better performance
const AREffectsPanel = React.memo(({ 
  product, 
  visible, 
  onClose, 
  onSelectEffect,
  onColorChange 
}: AREffectsPanelProps) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('original');

  // Return null early for performance if not visible
  if (!visible) return null;

  // Memoized handlers to prevent unnecessary re-renders
  const handleEffectSelect = useCallback((effectId: string) => {
    const newEffectValue = effectId === selectedEffect ? null : effectId;
    setSelectedEffect(newEffectValue);
    // Now we can directly pass null since the interface supports it
    onSelectEffect(newEffectValue);
  }, [selectedEffect, onSelectEffect]);

  const handleColorSelect = useCallback((colorId: string, colorHex: string) => {
    setSelectedColor(colorId);
    onColorChange(colorHex);
  }, [onColorChange]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AR Effects</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Effects Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Effects</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.effectsScrollView}>
            {AVAILABLE_EFFECTS.map((effect) => (
              <TouchableOpacity
                key={effect.id}
                style={[
                  styles.effectButton,
                  selectedEffect === effect.id && styles.selectedEffect
                ]}
                onPress={() => handleEffectSelect(effect.id)}
              >
                <Ionicons
                  name={effect.icon as any}
                  size={24}
                  color={selectedEffect === effect.id ? 'white' : '#333'}
                />
                <Text
                  style={[
                    styles.effectName,
                    selectedEffect === effect.id && styles.selectedEffectText
                  ]}
                >
                  {effect.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Colorways Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colorways</Text>
          <View style={styles.colorsGrid}>
            {AVAILABLE_COLORS.map((color) => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color.hex },
                  selectedColor === color.id && styles.selectedColor,
                  color.id === 'white' && styles.whiteColorBorder
                ]}
                onPress={() => handleColorSelect(color.id, color.hex)}
              />
            ))}
          </View>
        </View>

        {/* Product Info Section */}
        <View style={styles.productInfoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
          <Text style={styles.productDescription}>
            Virtually try on this {product.brand} shoe in different colors and with special effects.
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30, // Extra padding for bottom safety area
    maxHeight: '70%', // Maximum height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  effectsScrollView: {
    flexDirection: 'row',
  },
  effectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  selectedEffect: {
    backgroundColor: '#3B5BA5', // Prussian blue
    borderWidth: 2,
    borderColor: '#F3B941', // Mustard accent
  },
  effectName: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  selectedEffectText: {
    color: 'white',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#F3B941', // Mustard accent
    transform: [{scale: 1.15}], // Slightly enlarge the selected color
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  whiteColorBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  productInfoSection: {
    marginTop: 10,
    backgroundColor: 'rgba(59, 91, 165, 0.3)', // Prussian blue with opacity
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#E87A5D', // Orange accent
  },
  productName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#F3B941', // Mustard
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  productDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AREffectsPanel;