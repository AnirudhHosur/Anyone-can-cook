import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View, useWindowDimensions, ActivityIndicator } from "react-native";
import MapView from 'react-native-maps';
import OrderItem from "../../components/OrderItem";
import CustomMarker from "../../components/OrderItem/CustomMarker/CustomMarker";
import { db } from "../../services/config";

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [locationPermission, setLocationPermission] = useState(false);
    const bottomSheetRef = useRef(null);
    const { width, height } = useWindowDimensions();
    const snapPoints = useMemo(() => ["12%", "90%"], []);
    const [driverLocation, setDriverLocation] = useState(null);

    const fetchOrders = () => {
        const ordersQuery = query(collection(db, "orders"), where("status", "==", "READY_FOR_PICKUP"));
        const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
            const fetchedOrders = [];
            querySnapshot.forEach((doc) => {
                fetchedOrders.push({ id: doc.id, ...doc.data() });
            });
            setOrders(fetchedOrders);
        }, (error) => {
            console.error("Error fetching orders: ", error);
        });

        return unsubscribe;
    };

    useEffect(() => {
        if (locationPermission) {
            const unsubscribe = fetchOrders();
            return () => unsubscribe(); // Cleanup subscription on unmount
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

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (!status === "granted") {
                console.log("Nonono");
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    if (!driverLocation) {
        return <ActivityIndicator size={"large"} color="grey" />;
    }

    return (
        <View style={{ backgroundColor: 'lightblue', flex: 1 }}>
            {locationPermission ? (
                <MapView
                    style={{ height: height, width: width }}
                    showsUserLocation
                    followsUserLocation
                    initialRegion={{
                        latitude: driverLocation.latitude,
                        longitude: driverLocation.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}
                >
                    {orders.map((order) => (
                        <CustomMarker key={order.id} data={order.restaurant} type="RESTAURANT" />
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
