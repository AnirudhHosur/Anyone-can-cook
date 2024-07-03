import { useMemo, useRef } from "react";
import BottomSheet from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import styles from "./styles";
import { useOrderContext } from "../../navigation/OrderContext";
import { useNavigation } from '@react-navigation/native';

const STATUS_TO_TITLE = {
    READY_FOR_PICKUP: "Accept Order",
    ACCEPTED: "Pick up Order",
    PICKED_UP: "Complete Delivery"
}

const BottomSheetDetails = (props) => {
    const { totalKMs, totalMinutes, onAccepted } = props;
    const isDriverClose = totalKMs < 1; // decrease for higher accuracy
    const { acceptOrder, order, user, dishes, fetchOrder, completeOrder, pickUpOrder } = useOrderContext();
    const snapPoints = useMemo(() => ["12%", "95%"], []);
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();

    const onButtonPressed = async () => {
        bottomSheetRef.current?.collapse();
        if (order?.status === "READY_FOR_PICKUP") {
            acceptOrder();
            onAccepted();
        }

        if (order?.status === "ACCEPTED") { // Corrected status
            bottomSheetRef.current?.collapse();
            pickUpOrder();
        }

        if (order?.status === "PICKED_UP") {
            await completeOrder();
            bottomSheetRef.current?.collapse();
            navigation.goBack();
            console.warn('Delivery Finished');
        }
    };

    const isButtonDisabled = () => {
        const { status } = order;
        if (status === "READY_FOR_PICKUP") {
            return false;
        }
        if ((status === "ACCEPTED" || status === "PICKED_UP") && isDriverClose) {
            return false;
        }
        return true;
    };

    return (
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
                    backgroundColor: "#3FC060", marginTop: 'auto', marginVertical: 20, margin: 10, borderRadius: 10
                }}
                onPress={onButtonPressed}
            >
                <Text style={styles.buttonText}>
                    {STATUS_TO_TITLE[order.status]}
                </Text>
            </TouchableOpacity>
        </BottomSheet>
    );
};

export default BottomSheetDetails;