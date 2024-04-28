import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import LoginScreen from './src/screens/authScreens/LoginScreen';
import RegisterScreen from './src/screens/authScreens/RegisterScreen';

export default function App() {
  return (
    <NavigationContainer>
        <RootNavigator />
        <StatusBar style="light" />
    </NavigationContainer>
  );
}