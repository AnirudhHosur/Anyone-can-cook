import { useMemo, useRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import orders from '../../../assets/data/orders.json'
import OrderItem from "../../components/OrderItem";

const OrdersScreen = () => {

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["12%", "90%"], [])

    return (
        <View style={{ backgroundColor: 'lightblue', flex: 1 }}>
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