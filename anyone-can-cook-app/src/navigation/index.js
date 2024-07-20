import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { ActivityIndicator, View } from 'react-native';

import Basket from '../screens/Basket';
import DishDetailsScreen from '../screens/DishDetailsScreen';
import HomeScreen from '../screens/HomeScreen';
import OrderScreen from '../screens/OrdersScreen';
import { RestaurantDetailsScreen } from '../screens/RestaurantDetailsScreen';
import { Entypo, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import LoginScreen from '../screens/authScreens/LoginScreen';
import RegisterScreen from '../screens/authScreens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrderDetailsNavigator from './OrderDetailsNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { dbUser, authUser, loading } = useAuthContext();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!authUser ? (
                <>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                </>
            ) : !dbUser ? (
                <Stack.Screen name="Profile" component={ProfileScreen} />
            ) : (
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
            )}
        </Stack.Navigator>
    );
};

const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
    return (
        <Tab.Navigator barStyle={{ backgroundColor: 'white' }} activeColor="black" inactiveColor="grey">
            <Tab.Screen name='Home' component={HomeStackNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Entypo name="home" size={24} color={color} />
                    )
                }}
            />
            <Tab.Screen name='Orders Tab' component={OrderStackNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome6 name="list-check" size={24} color={color} />
                    )
                }}
            />
            <Tab.Screen name='Profile' component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="account-circle" size={24} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name='Restaurants' component={HomeScreen} options={{ headerTitleAlign: 'center' }} />
            <HomeStack.Screen name='Restaurant' component={RestaurantDetailsScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name='Dish' component={DishDetailsScreen} />
            <HomeStack.Screen name='Basket' component={Basket} />
        </HomeStack.Navigator>
    );
};

const OrdersStack = createNativeStackNavigator();

const OrderStackNavigator = () => {
    return (
        <OrdersStack.Navigator>
            <OrdersStack.Screen name='Orders' component={OrderScreen} options={{ headerTitleAlign: 'center' }} />
            <OrdersStack.Screen name='Order' component={OrderDetailsNavigator} options={{ headerTitleAlign: 'center', headerShown: 'false' }} />
        </OrdersStack.Navigator>
    );
};

export default RootNavigator;