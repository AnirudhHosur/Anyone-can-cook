import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import LoginScreen from './src/screens/authScreens/LoginScreen';
import RegisterScreen from './src/screens/authScreens/RegisterScreen';
import BasketContextProvider from './src/navigation/BasketContext';

export default function App() {
  return (
    <NavigationContainer>
      <BasketContextProvider>
        <RootNavigator />
      </BasketContextProvider>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}