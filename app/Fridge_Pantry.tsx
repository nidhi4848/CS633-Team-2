import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';

type ListItemProps = {
  title: string;
};

const ListItem: React.FC<ListItemProps> = ({ title }) => (
  <View style={styles.listItem}>
    <TouchableOpacity style={styles.iconButton}>
      <Icon name="favorite-border" size={24} color="#6B21A8" />
    </TouchableOpacity>
    <Text style={styles.listText}>{title}</Text>
    <RNPickerSelect
      onValueChange={(value) => console.log(value)}
      items={[
        { label: 'Stocks', value: 'stocks' },
        { label: 'Other', value: 'other' },
      ]}
      style={pickerSelectStyles}
      placeholder={{ label: 'Select...', value: null }}
    />
    <TouchableOpacity style={styles.addButton}>
      <Text style={styles.addButtonText}>Add</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.moreButton}>
      <Icon name="more-vert" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

const FridgeAndPantryScreen: React.FC = () => {
  const data = Array(5).fill({ title: 'List item' });

  return (
    <View style={styles.container}>
      {/* Fridge Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fridge</Text>
        <Icon name="kitchen" size={24} color="black" />
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem title={item.title} />}
        keyExtractor={(_, index) => index.toString()}
        style={styles.listContainer}
      />

      {/* Pantry Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pantry</Text>
        <Icon name="emoji-food-beverage" size={24} color="black" />
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem title={item.title} />}
        keyExtractor={(_, index) => index.toString()}
        style={styles.listContainer}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {['Home', 'Pantry', 'Meals', 'Recipes', 'AIChat', 'Profile'].map((tab) => (
          <TouchableOpacity key={tab} style={styles.navItem}>
            <Text style={styles.navText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F97316',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 5,
  },
  listContainer: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
    borderRadius: 8,
  },
  iconButton: {
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFEDD5',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#000',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default FridgeAndPantryScreen;
