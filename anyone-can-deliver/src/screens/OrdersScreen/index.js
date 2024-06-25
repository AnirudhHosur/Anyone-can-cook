import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { auth, db } from "../../services/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import OrderItem from "../../components/OrderItem";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Entypo } from '@expo/vector-icons';

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [locationPermission, setLocationPermission] = useState(false);
    const bottomSheetRef = useRef(null);
    const { width, height } = useWindowDimensions();
    const snapPoints = useMemo(() => ["12%", "90%"], []);

    const fetchOrders = async () => {
        try {
            const ordersQuery = query(collection(db, "orders"), where("status", "==", "READY_FOR_PICKUP"));
            const querySnapshot = await getDocs(ordersQuery);
            const fetchedOrders = [];
            querySnapshot.forEach((doc) => {
                fetchedOrders.push({ id: doc.id, ...doc.data() });
            });
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error fetching orders: ", error);
        }
    };

    useEffect(() => {
        if (locationPermission) {
            fetchOrders();
        }
    }, [locationPermission]);

    useEffect(() => {
        (async () => {
            await requestLocationPermission();
        })();
    }, []);

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }
        setLocationPermission(true);
    };

    return (
        <View style={{ backgroundColor: 'lightblue', flex: 1 }}>
            {locationPermission ? (
                <MapView
                    style={{ height: height, width: width }}
                    showsUserLocation
                    followsUserLocation
                >
                    {orders.map((order) => (
                        <Marker
                            key={order.id}
                            title={order.restaurant?.name || "Unknown Restaurant"}
                            description={order.restaurant?.address || "No Address"}
                            coordinate={{
                                latitude: order.restaurant?.lat || 0,
                                longitude: order.restaurant?.lng || 0
                            }}
                        >
                            <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 20 }}>
                                <Entypo name="shop" size={24} color="white" />
                            </View>
                        </Marker>
                    ))}
                </MapView>
            ) : (
                <Text>Requesting for location permission...</Text>
            )}
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
            >
                <View style={{ alignItems: "center", marginBottom: 30 }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "600",
                            letterSpacing: 0.5,
                            paddingBottom: 5,
                        }}
                    >You're Online</Text>
                    <Text style={{ letterSpacing: 0.5, color: "grey" }}>Available Orders: {orders.length}</Text>
                </View>
                <BottomSheetFlatList
                    data={orders}
                    renderItem={({ item }) => <OrderItem order={item} />}
                />
            </BottomSheet>
        </View>
    )
}

export default OrdersScreen;
