import { StyleSheet, Text, View } from 'react-native';

const BasketDishItem = ({ basketDish }) => {

    const { quantity, dish } = basketDish;
    const { name, price } = dish;

    return (
        <View style={styles.row}>
            <View style={styles.quantityContainer}>
                <Text>{basketDish.quantity}</Text>
            </View>
            <Text style={{ fontWeight: '600', letterSpacing: 0.5 }}>{name}</Text>
            <Text style={{ marginLeft: 'auto' }}>$ {price}</Text>
        </View>
    )
}

export default BasketDishItem;

const styles = StyleSheet.create({

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

    quantityContainer: {
        backgroundColor: "lightgray",
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginRight: 10,
        borderRadius: 3,
    },
});