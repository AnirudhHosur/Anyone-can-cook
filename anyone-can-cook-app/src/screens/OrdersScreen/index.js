import { Image, StyleSheet, FlatList, View, Text } from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'
import orders from '../../../assets/data/orders.json'
import OrderListItem from '../../components/OrderListItem';

export default function OrderScreen() {

    return (
        <View style={{flex: 1, width: '100%', paddingTop: 50}}>
            <FlatList
                data={orders}
                renderItem={({ item }) => <OrderListItem order={item}/>}
            />
        </View>
    )
}