import { Image, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchDish } from '../../services/firebaseServices';

const DishDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { dishId } = route.params;

    const [dish, setDish] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const loadDish = async () => {
            try {
                const fetchedDish = await fetchDish(dishId);
                if (fetchedDish) {
                    setDish(fetchedDish);
                } else {
                    console.error('No dish data available');
                }
            } catch (error) {
                console.error('Error fetching dish:', error);
            }
        };

        loadDish();
    }, [dishId]);


    const onMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const onPlus = () => {
        setQuantity(quantity + 1);
    };

    const getTotal = () => {
        if (dish) {
            return (dish.price * quantity).toFixed(2);
        }
        return "0.00";
    };

    if (!dish) {
        return <View style={styles.page}><Text>Loading...</Text></View>;
    }

    return (
        <View style={styles.page}>
            <Text style={styles.name}>{dish.name}</Text>
            <Text style={styles.description}>{dish.shortDescription}</Text>

            <View style={styles.separator} />

            <View style={styles.row}>
                <AntDesign name='minuscircleo' size={60} color={"black"} onPress={onMinus} />
                <Text style={styles.quantity}>{quantity}</Text>
                <AntDesign name='pluscircleo' size={60} color={"black"} onPress={onPlus} />
            </View>

            <Pressable onPress={() => navigation.navigate('Basket')} style={styles.button}>
                <Text style={styles.buttonText}>Add {quantity} to basket • $ {getTotal()}</Text>
            </Pressable>
        </View>
    );
}

export default DishDetailsScreen;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: '100%',
        paddingVertical: 40,
        padding: 10
    },

    name: {
        fontSize: 30,
        fontWeight: '600',
        marginVertical: 10
    },

    description: {
        color: 'grey'
    },

    separator: {
        height: 1,
        backgroundColor: 'lightgrey',
        marginVertical: 10
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },

    quantity: {
        fontSize: 25,
        marginHorizontal: 20
    },

    button: {
        backgroundColor: 'black',
        marginTop: 'auto',
        padding: 20,
        alignItems: 'center'
    },

    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 20
    }
});