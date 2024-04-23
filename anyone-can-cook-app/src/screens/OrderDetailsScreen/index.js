import { Image, StyleSheet, FlatList, View, Text } from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'
import orders from '../../../assets/data/orders.json'
import OrderListItem from '../../components/OrderListItem';
import DishListItem from '../../components/DishListItem';
import BasketDishItem from '../../components/BasketDishItem';

const order = orders[0]

const OrderDetailsHeader = () => {

    return (
        <View>
            <View style={styles.page}>
                <Image
                    source={{ uri: order.Restaurant.image }}
                    style={styles.image}
                    resizeMode='cover'
                />

                <View style={styles.container}>
                    <Text style={styles.title}>{order.Restaurant.name}</Text>
                    <Text style={styles.subtitle}>{order.status} • 2 days ago</Text>

                    <Text style={styles.orderTitle}>Your Order</Text>
                </View>
            </View>
        </View>
    )
}

const OrderDetails = () => {

    return (
        <FlatList
            ListHeaderComponent={OrderDetailsHeader}
            data={restaurants[0].dishes}
            renderItem={({ item }) => <BasketDishItem basketDish={item} />}
        />
    )
}

export default OrderDetails

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    container: {
        margin: 10
    },

    image: {
        width: '100%',
        aspectRatio: 5 / 3
    },

    iconContainer: {
        position: 'absolute',
        top: 40,
        left: 10
    },

    title: {
        fontSize: 35,
        fontWeight: '600',
        marginVertical: 10,
    },

    subtitle: {
        color: 'grey',
        fontSize: 15
    },

    orderTitle: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: '500',
        letterSpacing: 0.7
    }
});