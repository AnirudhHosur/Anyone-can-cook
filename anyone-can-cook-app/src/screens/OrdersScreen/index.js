import { Image, StyleSheet, FlatList, View, Text } from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'
import orders from '../../../assets/data/orders.json'
import OrderListItem from '../../components/OrderListItem';
import { useOrderContext } from '../../navigation/OrderContext';

export default function OrderScreen() {

    const { orders } = useOrderContext();
    console.log('order data', orders)
    
    return (
        <View style={{flex: 1, width: '100%'}}>
            <FlatList
                data={orders}
                renderItem={({ item }) => <OrderListItem order={item}/>}
            />
        </View>
    )
}