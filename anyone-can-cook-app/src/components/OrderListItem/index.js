import { Image, StyleSheet, FlatList, View, Text } from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'

export default function OrderListItem({ order }) {

    return (
        <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
            <Image
                source={{ uri: order.Restaurant.image }}
                style={{ width: 75, height: 75, marginRight: 5 }}
            />

            <View>
                <Text style={{fontWeight: '600', fontSize: 16}}>{order.Restaurant.name}</Text>
                <Text style={{marginVertical: 5, color: 'lightgrey'}}>3 items $38</Text>
                <Text style={{color: 'lightgrey'}}>2 days ago • {order.status}</Text>
            </View>
        </View>
    )
}