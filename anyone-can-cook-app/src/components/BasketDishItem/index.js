import { FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'
import { AntDesign } from '@expo/vector-icons'
import { useState } from 'react';

const restaurant = restaurants[0]


const BasketDishItem = ({ basketDish }) => {
    return (
        <View style={styles.row}>
            <View style={styles.quantityContainer}>
                <Text>1</Text>
            </View>
            <Text style={{ fontWeight: '600', letterSpacing: 0.5 }}>{basketDish.name}</Text>
            <Text style={{ marginLeft: 'auto' }}>$ {basketDish.price}</Text>
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