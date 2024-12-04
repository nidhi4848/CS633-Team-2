import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BottomNavProps {
  items: string[];
  onNavigate: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, onNavigate }) => {
  return (
    <View style={styles.bottomNav}>
      {items.map((tab) => (
        <TouchableOpacity key={tab} style={styles.navItem} onPress={() => onNavigate(tab)}>
          <Text style={styles.navText}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#ff870a',
    width: '100%',
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});

export default BottomNav;
