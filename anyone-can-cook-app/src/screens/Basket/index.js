import { FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'
import { useBasketContext } from '../../navigation/BasketContext';
import BasketDishItem from '../../components/BasketDishItem';

//const restaurant = restaurants[0]

const Basket = () => {

    const { restaurant, basketDishes, totalPrice } = useBasketContext();
    const deliveryFee = restaurant.deliveryFee || 0;
    const finalTotal = totalPrice + deliveryFee;

    return (
        <View style={styles.page}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.yourItems}>Your Items</Text>

            <FlatList
                data={basketDishes}
                renderItem={({ item }) => <BasketDishItem basketDish={item} />}
            />

            <View style={styles.separator} />

            <View style={{ paddingHorizontal: 10 }}>
                <Text style={styles.totalLabel}>Total Price: ${totalPrice.toFixed(2)}</Text>
                <Text style={styles.totalLabel}>Delivery Fee: ${deliveryFee.toFixed(2)}</Text>
                <Text style={styles.totalLabel}>Final Total: ${finalTotal.toFixed(2)}</Text>
            </View>

            <View style={styles.button}>
                <Text style={styles.buttonText}>Create Order </Text>
            </View>
        </View>
    );
}

export default Basket;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: "100%",
        //paddingVertical: 40,
        padding: 10,
    },
    yourItems: {
        marginTop: 20,
        fontSize: 18,
        letterSpacing: 0.7
    },
    name: {
        fontSize: 24,
        fontWeight: "600",
        marginVertical: 10,
    },
    description: {
        color: "gray",
    },
    separator: {
        height: 1,
        backgroundColor: "lightgrey",
        marginVertical: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    quantity: {
        fontSize: 25,
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: "black",
        marginTop: "auto",
        padding: 20,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 18,
    },
    quantityContainer: {
        backgroundColor: "lightgray",
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginRight: 10,
        borderRadius: 3,
    },
    totalLabel: {
        fontSize: 16,
        marginVertical: 8, // Add some space between the totals for better readability
    },
});