import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { FontAwesome5 } from "@expo/vector-icons";
import { db } from "../../services/config";

const OrderLiveUpdates = ({ id }) => {
    const [order, setOrder] = useState(null);
    const [courier, setCourier] = useState(null);

    const mapRef = useRef(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderRef = doc(db, "orders", id);
                const orderSnap = await getDoc(orderRef);

                if (orderSnap.exists()) {
                    setOrder(orderSnap.data());
                } else {
                    console.log("No such order!");
                }
            } catch (error) {
                console.error("Error fetching order: ", error);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    useEffect(() => {
        const fetchCourier = async (courierId) => {
            try {
                const courierRef = doc(db, "courier", courierId);
                const courierSnap = await getDoc(courierRef);

                if (courierSnap.exists()) {
                    setCourier(courierSnap.data());
                } else {
                    console.log("No such courier!");
                }
            } catch (error) {
                console.error("Error fetching courier: ", error);
            }
        };

        if (order?.courier?.id) {
            fetchCourier(order.courier.id);
        }
    }, [order]);

    useEffect(() => {
        if (courier?.lng && courier?.lat) {
            mapRef.current.animateToRegion({
                latitude: courier.lat,
                longitude: courier.lng,
                latitudeDelta: 0.007,
                longitudeDelta: 0.007,
            });
        }
    }, [courier?.lng, courier?.lat]);

    useEffect(() => {
        if (!order?.courier?.id) {
            return;
        }

        const courierRef = doc(db, "courier", order.courier.id);
        const unsubscribe = onSnapshot(courierRef, (docSnap) => {
            if (docSnap.exists()) {
                setCourier(docSnap.data());
            } else {
                console.log("Courier data not found!");
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [order?.courier?.id]);

    useEffect(() => {
        if (!order) {
            return;
        }
        const orderRef = doc(db, "orders", id);
        const unsubscribe = onSnapshot(orderRef, (docSnap) => {
            if (docSnap.exists()) {
                const updatedOrder = docSnap.data();
                console.log("Updated Order Status:", updatedOrder.status);
                setOrder(updatedOrder);
            } else {
                console.log("Order data not found!");
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [order?.id]);

    return (
        <View>
            <Text>Status: {order?.status || "loading"}</Text>
            <MapView style={styles.map} ref={mapRef} showsUserLocation>
                {courier?.lat && (
                    <Marker
                        coordinate={{ latitude: courier.lat, longitude: courier.lng }}
                    >
                        <View
                            style={{
                                padding: 5,
                                backgroundColor: "green",
                                borderRadius: 40,
                            }}
                        >
                            <FontAwesome5 name="motorcycle" size={24} color="white" />
                        </View>
                    </Marker>
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
    },
});

export default OrderLiveUpdates;