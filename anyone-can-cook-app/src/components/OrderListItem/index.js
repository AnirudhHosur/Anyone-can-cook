import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export default function OrderListItem({ order }) {
    const navigation = useNavigation();

    const onPress = () => {
        navigation.navigate('Order', { id: order.id });
    };

    return (
        <Pressable onPress={onPress} style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
            <Image
                source={{ uri: order.restaurant.image }}
                style={{ width: 75, height: 75, marginRight: 5 }}
            />
            <View>
                <Text style={{ fontWeight: '600', fontSize: 16 }}>{order.restaurant.name}</Text>
                <Text style={{ marginVertical: 5, color: 'lightgrey' }}>3 items $38</Text>
                <Text style={{ color: 'lightgrey' }}>2 days ago • {order.status}</Text>
            </View>
        </Pressable>
    );
}