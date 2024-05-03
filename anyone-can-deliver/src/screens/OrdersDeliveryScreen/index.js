import { useMemo, useRef } from "react";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text } from "react-native";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import orders from '../../../assets/data/orders.json'
import styles from "./styles";

const order = orders[0]

const OrderDeliveryScreen = () => {

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["12%", "95%"], [])

    return (
        <View style={styles.container}>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} handleIndicatorStyle={styles.handleIndicator}>
                <View style={styles.handleIndicatorContainer}>
                    <Text style={styles.routeDetailsText}>14 min</Text>
                    <FontAwesome5
                        name="shopping-bag"
                        size={30}
                        color="#3FC060"
                        style={{ marginHorizontal: 10 }}
                    />
                    <Text style={styles.routeDetailsText}>5.35 km</Text>
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