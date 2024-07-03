import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";
import MapView from 'react-native-maps';
import MapViewDirections from "react-native-maps-directions";
import CustomMarker from "../../components/OrderItem/CustomMarker/CustomMarker";
import { useOrderContext } from "../../navigation/OrderContext";
import BottomSheetDetails from "./BottomSheetDetails";
import styles from "./styles";
import { AuthContext } from "../../navigation/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/config";
import { GOOGLE_MAPS_API_KEY } from '@env';

const OrderDeliveryScreen = () => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalKMs, setTotalKMs] = useState(0);
    const mapRef = useRef(null);
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;
    const { dbCourier } = useContext(AuthContext);
    const { acceptOrder, order, user, dishes, fetchOrder, completeOrder, pickUpOrder } = useOrderContext();

    useEffect(() => {
        fetchOrder(id);
    }, [id]);

    useEffect(() => {
        if (!driverLocation) {
            return;
        }
        // Save to Firestore
        const updateCourierLocation = async () => {
            try {
                const courierRef = doc(db, "courier", dbCourier.id);
                await updateDoc(courierRef, {
                    lat: driverLocation.latitude,
                    lng: driverLocation.longitude,
                });
            } catch (error) {
                console.error("Error updating location: ", error);
            }
        };
        updateCourierLocation();
    }, [driverLocation, dbCourier.id]);

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
                    distanceInterval: 500
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

    const zoomInOnDriver = () => {
        mapRef.current.animateToRegion({
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        });
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
                    destination={order?.status === "ACCEPTED" ?
                        restaurantLocation
                        : deliveryLocation
                    }
                    waypoints={
                        order?.status === "READY_FOR_PICKUP" ?
                            [restaurantLocation]
                            : []}
                    strokeWidth={10}
                    strokeColor="#3FC060"
                    apikey={GOOGLE_MAPS_API_KEY}
                    onReady={(result) => {
                        setTotalMinutes(result.duration)
                        setTotalKMs(result.distance)
                    }}
                />

                <CustomMarker data={order?.restaurant} type="RESTAURANT" />
                <CustomMarker data={user} type="USER" />
            </MapView>

            <BottomSheetDetails totalKMs={totalKMs} totalMinutes={totalMinutes} onAccepted={zoomInOnDriver} />

            {order?.status === "READY_FOR_PICKUP" && (
                <Ionicons
                    onPress={() => navigation.goBack()}
                    name="arrow-back-circle"
                    size={45}
                    color="black"
                    style={{ top: 40, left: 15, position: "absolute" }}
                />
            )}
        </View>
    )
}

export default OrderDeliveryScreen;