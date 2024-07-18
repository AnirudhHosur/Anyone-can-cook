import { FlatList, View, Text, StyleSheet, Pressable } from 'react-native';
import OrderListItem from '../../components/OrderListItem';
import { useOrderContext } from '../../navigation/OrderContext';
import { useNavigation } from '@react-navigation/native';

export default function OrderScreen() {
    const { orders } = useOrderContext();
    const navigation = useNavigation();

    if (orders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Orders yet!</Text>
                <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Explore Restaurants</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={({ item }) => <OrderListItem order={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 10,
    },
    list: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});