import { useMemo, useRef, useEffect, useState } from "react";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, useWindowDimensions, ActivityIndicator, Pressable, TouchableOpacity } from "react-native";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import styles from "./styles";
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { Entypo } from '@expo/vector-icons'
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"
import { auth, db } from "../../services/config";
import { useOrderContext } from "../../navigation/OrderContext";

const OrderDeliveryScreen = () => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalKMs, setTotalKMs] = useState(0);
    const mapRef = useRef(null);
    const [isDriverClose, setIsDriverClose] = useState(false);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["12%", "95%"], []);
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;

    const { acceptOrder, order, user, dishes, fetchOrder, completeOrder, pickUpOrder } = useOrderContext();

    useEffect(() => {
        fetchOrder(id);
    }, [id]);

    console.log('Hey love', order)

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

    const onButtonPressed = async () => {
        bottomSheetRef.current?.collapse();
        if (order?.status === "READY_FOR_PICKUP") {
            mapRef.current.animateToRegion({
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            });
            acceptOrder();
        }

        if (order?.status === "ACCEPETD") {
            bottomSheetRef.current?.collapse();
            pickUpOrder()
        }

        if (order?.status === "PICKED_UP") {
            await completeOrder()
            bottomSheetRef.current?.collapse();
            navigation.goBack();
            console.warn('Delivery Finished')
        }
    }

    const renderButtonTitle = () => {
        if (order?.status === "READY_FOR_PICKUP") {
            return 'Accept Order'
        }
        if (order?.status === "ACCEPETD") {
            return 'Pick-up Order'
        }
        if (order?.status === "PICKED_UP") {
            return 'Complete Delivery'
        }
    }

    const isButtonDisabled = () => {
        if (order?.status === "READY_FOR_PICKUP") {
            return false
        }
        if (order?.status === "ACCEPETD" && isDriverClose) {
            return false
        }
        if (order?.status === "PICKED_UP" && isDriverClose) {
            return false
        }
        return true;
    }

    const restaurantLocation = { latitude: order?.restaurant?.lat, longitude: order?.restaurant?.lng };
    const deliveryLocation = { latitude: user?.lat, longitude: user?.lng };

    if (!driverLocation || !order || !user) {
        return <ActivityIndicator size={"large"} color="grey" />;
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
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
                    destination={order?.status === "ACCEPETD" ?
                        restaurantLocation
                        : deliveryLocation
                    }
                    waypoints={
                        order?.status === "READY_FOR_PICKUP" ?
                            [restaurantLocation]
                            : []}
                    strokeWidth={10}
                    strokeColor="#3FC060"
                    apikey={"AIzaSyCKdT7qr19cJyG3cFR7jdjNzdKGdiOYxlk"}
                    onReady={(result) => {
                        setIsDriverClose(result.distance <= 0.1);
                        setTotalMinutes(result.duration)
                        setTotalKMs(result.distance)
                    }}
                />

                <Marker
                    coordinate={{ latitude: order.restaurant.lat, longitude: order.restaurant.lng }}
                    title={order.restaurant.name}
                    description={order.restaurant.address}
                >
                    <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 20 }}>
                        <Entypo name="shop" size={24} color="white" />
                    </View>
                </Marker>

                <Marker
                    coordinate={deliveryLocation}
                    title={user.firstName}
                    description={user.address}
                >
                    <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 20 }}>
                        <Entypo name="cake" size={24} color="white" />
                    </View>
                </Marker>

            </MapView>

            {order?.status === "READY_FOR_PICKUP" && (
                <Ionicons
                    onPress={() => navigation.goBack()}
                    name="arrow-back-circle"
                    size={45}
                    color="black"
                    style={{ top: 40, left: 15, position: "absolute" }}
                />
            )}

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
                    <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
                    <View style={styles.adressContainer}>
                        <Fontisto name="shopping-store" size={22} color="grey" />
                        <Text style={styles.adressText}>{order.restaurant.address}</Text>
                    </View>
                    <View style={styles.adressContainer}>
                        <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
                        <Text style={styles.adressText}>{user.address}</Text>
                    </View>

                    <View style={styles.orderDetailsContainer}>
                        {
                            dishes.map((item) => (
                                <Text key={item.id} style={styles.orderItemText}>{item.dish.name} x{item.quantity}</Text>
                            ))
                        }
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#3FC060", marginTop: 'auto', marginVertical: 20, margin: 10, borderRadius: 10,
                        backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060'
                    }}
                    onPress={onButtonPressed} disabled={isButtonDisabled()}
                >
                    <Text style={styles.buttonText}>
                        {renderButtonTitle()}
                    </Text>
                </TouchableOpacity>
            </BottomSheet>
        </View>
    )
}

export default OrderDeliveryScreen;