import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import BasketDishItem from '../../components/BasketDishItem';
import { useOrderContext } from '../../navigation/OrderContext';

const OrderDetailsHeader = ({ order }) => {

    return (
        <View>
            <View style={styles.page}>
                <Image
                    source={{ uri: order.restaurant.image }}
                    style={styles.image}
                    resizeMode='cover'
                />

                <View style={styles.container}>
                    <Text style={styles.title}>{order.restaurant.name}</Text>
                    <Text style={styles.subtitle}>{order.status} • 2 days ago</Text>

                    <Text style={styles.orderTitle}>Your Order</Text>
                </View>
            </View>
        </View>
    )
}

const OrderDetails = ({ id }) => {

    const [order, setOrder] = useState();
    const { getOrder } = useOrderContext();
    // const route = useRoute();
    // const id = route.params?.id;

    useEffect(() => {
        getOrder(id).then(setOrder)
    }, [id])

    if (!order) {
        return <ActivityIndicator size={"large"} color="blue" />
    }

    return (
        <FlatList
            ListHeaderComponent={() => <OrderDetailsHeader order={order} />}
            data={order.dishes}
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