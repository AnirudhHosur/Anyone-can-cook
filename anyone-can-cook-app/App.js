import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import { RestaurantDetailsScreen } from './src/screens/RestaurantDetailsScreen';
import DishDetailsScreen from './src/screens/DishDetailsScreen';
import Basket from './src/screens/Basket';
import OrderScreen from './src/screens/OrdersScreen';
import OrderDetails from './src/screens/OrderDetailsScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <Basket />

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    //padding: 10,
  },
});
