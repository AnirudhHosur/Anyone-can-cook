import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';

export default function OrderListItem({ order }) {
    const navigation = useNavigation();

    const onPress = () => {
        navigation.navigate('Order', { id: order.id });
    };

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image
                source={{ uri: order.restaurant.image }}
                style={styles.image}
            />
            <View style={styles.details}>
                <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
                <Text style={styles.orderDetails}>3 items • ${order.totalPrice}</Text>
                <Text style={styles.orderInfo}>2 days ago • {order.status}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    details: {
        flex: 1,
        padding: 10,
    },
    restaurantName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    orderDetails: {
        color: '#555',
        marginBottom: 5,
    },
    orderInfo: {
        color: '#777',
    },
});