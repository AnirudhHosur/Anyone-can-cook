import { useMemo, useRef, useEffect, useState } from "react";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, useWindowDimensions, ActivityIndicator } from "react-native";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import orders from '../../../assets/data/orders.json'
import styles from "./styles";
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { Entypo } from '@expo/vector-icons'
import MapViewDirections from "react-native-maps-directions";

const order = orders[0]

const OrderDeliveryScreen = () => {
    const [driverLocation, setDriverLocation] = useState(null)
    const [totalMinutes, setTotalMinutes] = useState(0)
    const [totalKMs, setTotalKMs] = useState(0)

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["12%", "95%"], [])
    const { width, height } = useWindowDimensions();

    useEffect(() => {
        let foregroundSubscription;

        const fetchLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Location permission not granted");
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            foregroundSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 100
                }, (updatedLocation) => {
                    setDriverLocation({
                        latitude: updatedLocation.coords.latitude,
                        longitude: updatedLocation.coords.longitude
                    });
                }
            );
        };

        fetchLocation();

        return () => {
            if (foregroundSubscription) {
                foregroundSubscription.remove();
            }
        };

    }, []);

    if (!driverLocation) {
        return <ActivityIndicator size={"large"} />
    }

    return (
        <View style={styles.container}>
            <MapView
                style={{ width, height }}
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.07
                }}
                showsUserLocation
                followsUserLocation
            >
                <MapViewDirections
                    origin={driverLocation}
                    destination={{ latitude: order.User.lat, longitude: order.User.lng }}
                    waypoints={[{ latitude: order.Restaurant.lat, longitude: order.Restaurant.lng }]}
                    strokeWidth={10}
                    strokeColor="#3FC060"
                    apikey={"AIzaSyCKdT7qr19cJyG3cFR7jdjNzdKGdiOYxlk"}
                    onReady={(result) => {
                        setTotalMinutes(result.duration)
                        setTotalKMs(result.distance)
                    }}
                />

                <Marker
                    coordinate={{ latitude: order.Restaurant.lat, longitude: order.Restaurant.lng }}
                    title={order.Restaurant.name}
                    description={order.Restaurant.address}
                >
                    <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 20 }}>
                        <Entypo name="shop" size={24} color="white" />
                    </View>
                </Marker>

                <Marker
                    coordinate={{ latitude: order.User.lat, longitude: order.User.lng }}
                    title={order.User.name}
                    description={order.User.address}
                >
                    <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 20 }}>
                        <Entypo name="cake" size={24} color="white" />
                    </View>
                </Marker>

            </MapView>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} handleIndicatorStyle={styles.handleIndicator}>
                <View style={styles.handleIndicatorContainer}>
                    <Text style={styles.routeDetailsText}>{totalMinutes.toFixed(1)} min</Text>
                    <FontAwesome5
                        name="shopping-bag"
                        size={30}
                        color="#3FC060"
                        style={{ marginHorizontal: 10 }}
                    />
                    <Text style={styles.routeDetailsText}>{totalKMs.toFixed(2)} km</Text>
                </View>

                <View style={styles.deliveryDetailsContainer}>
                    <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
                    <View style={styles.adressContainer}>
                        <Fontisto name="shopping-store" size={22} color="grey" />
                        <Text style={styles.adressText}>{order.Restaurant.address}</Text>
                    </View>
                    <View style={styles.adressContainer}>
                        <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
                        <Text style={styles.adressText}>{order.User.address}</Text>
                    </View>

                    <View style={styles.orderDetailsContainer}>
                        <Text style={styles.orderItemText}>Onion Rings x1</Text>
                        <Text style={styles.orderItemText}>Dosa x1</Text>
                        <Text style={styles.orderItemText}>Potatoes x1</Text>
                        <Text style={styles.orderItemText}>Water x1</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: "#3FC060", marginTop: 'auto', marginVertical: 20, margin: 10, borderRadius: 10 }}>
                    <Text style={styles.buttonText}>
                        Accept Order
                    </Text>
                </View>
            </BottomSheet>
        </View>
    )
}

export default OrderDeliveryScreen;