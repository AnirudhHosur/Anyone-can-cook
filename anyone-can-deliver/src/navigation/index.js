import React, { useContext } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../screens/OrdersScreen";
import OrderDeliveryScreen from "../screens/OrdersDeliveryScreen";
import { AuthContext } from "./AuthContext";
import SignInScreen from "../screens/AuthScreens/SignInScreen";
import SignUpScreen from "../screens/AuthScreens/SignUpScreen";
import ProfileScreen from '../screens/ProfileScreen';
import { ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    const { authUser, dbCourier } = useContext(AuthContext);

    // if (dbCourier === null) {
    //     return <ActivityIndicator size={"large"} color="grey" />;
    // }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {authUser ? (
                dbCourier ? (
                    <>
                        <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
                        <Stack.Screen name="OrderDeliveryScreen" component={OrderDeliveryScreen} />
                    </>
                ) : (
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                )
            ) : (
                <>
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default Navigation;