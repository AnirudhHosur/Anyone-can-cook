import { useMemo, useRef, useEffect, useState } from "react";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, useWindowDimensions, ActivityIndicator, Pressable, TouchableOpacity } from "react-native";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import orders from '../../../assets/data/orders.json'
import styles from "./styles";
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { Entypo } from '@expo/vector-icons'
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const order = orders[0]

const restaurantLocation = { latitude: order.Restaurant.lat, longitude: order.Restaurant.lng }
const deliveryLocation = { latitude: order.User.lat, longitude: order.User.lng }

const ORDER_STATUS = {
    READY_FOR_PICKUP: "READY_FOR_PICKUP",
    ACCEPETD: "ACCEPTED",
    PICKED_UP: "PICKED_UP",
    COMPLETED: "COMPLETED"
}

const OrderDeliveryScreen = () => {
    const [driverLocation, setDriverLocation] = useState(null)
    const [totalMinutes, setTotalMinutes] = useState(0)
    const [totalKMs, setTotalKMs] = useState(0)

    const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUS.READY_FOR_PICKUP)
    const mapRef = useRef(null)
    const [isDriverClose, setIsDriverClose] = useState(false);

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["12%", "95%"], [])
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();

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

    const onButtonPressed = () => {
        bottomSheetRef.current?.collapse();
        if (deliveryStatus === ORDER_STATUS.READY_FOR_PICKUP) {
            mapRef.current.animateToRegion({
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            });
            setDeliveryStatus(ORDER_STATUS.ACCEPETD);
        }

        if (deliveryStatus === ORDER_STATUS.ACCEPETD) {
            bottomSheetRef.current?.collapse();
            setDeliveryStatus(ORDER_STATUS.PICKED_UP)
        }

        if (deliveryStatus === ORDER_STATUS.PICKED_UP) {
            bottomSheetRef.current?.collapse();
            navigation.goBack();
            console.warn('Delivery Finished')
        }
    }

    const renderButtonTitle = () => {
        if (deliveryStatus === ORDER_STATUS.READY_FOR_PICKUP) {
            return 'Accept Order'
        }
        if (deliveryStatus === ORDER_STATUS.ACCEPETD) {
            return 'Pick-up Order'
        }
        if (deliveryStatus === ORDER_STATUS.PICKED_UP) {
            return 'Complete Delivery'
        }
    }

    const isButtonDisabled = () => {
        if (deliveryStatus === ORDER_STATUS.READY_FOR_PICKUP) {
            return false
        }
        if (deliveryStatus === ORDER_STATUS.ACCEPETD && isDriverClose) {
            return false
        }
        if (deliveryStatus === ORDER_STATUS.PICKED_UP && isDriverClose) {
            return false
        }
        return true;
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
                    destination={deliveryStatus === ORDER_STATUS.ACCEPETD ?
                        restaurantLocation
                        : deliveryLocation
                    }
                    waypoints={
                        deliveryStatus === ORDER_STATUS.READY_FOR_PICKUP ?
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

            {order.status === "READY_FOR_PICKUP" && (
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