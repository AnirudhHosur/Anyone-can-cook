import { Image, StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DishListItem from '../../components/DishListItem';
import styles from './styles';
import RestaurantHeader from './header';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useBasketContext } from '../../navigation/BasketContext';
import { fetchRestaurants, fetchDishes } from '../../services/firebaseServices'

export const RestaurantDetailsScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { restaurantId } = route.params;

    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);

    const { setRestaurant: setBasketRestaurant, basket, basketDishes } = useBasketContext()

    useEffect(() => {
        const getRestaurantDetails = async () => {
            setBasketRestaurant(null);
            const allRestaurants = await fetchRestaurants();
            const foundRestaurant = allRestaurants.find(r => r.id === restaurantId);
            if (foundRestaurant) {
                setRestaurant(foundRestaurant);
                // Coming from BasketContext
                setBasketRestaurant(foundRestaurant);
                const fetchedDishes = await fetchDishes(restaurantId);
                setDishes(fetchedDishes)
            }
        }

        getRestaurantDetails();

    }, [restaurantId]);

    if (!restaurant) {
        return (
            <View style={styles.page}>
                <Text>No restaurant found</Text>
            </View>
        );
    }

    return (
        <View style={styles.page}>
            <FlatList
                data={dishes}
                renderItem={({ item }) => <DishListItem dish={item} />}
                ListHeaderComponent={() => <RestaurantHeader restaurant={restaurant} />}
                keyExtractor={(item) => item.id.toString()}
            />

            <Ionicons
                onPress={() => navigation.goBack()}
                name="arrow-back-circle"
                size={40}
                color="white"
                style={styles.iconContainer}
            />
            {
                basket && <Pressable onPress={() => navigation.navigate("Basket")} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Open Basket • ({basketDishes.length})
                    </Text>
                </Pressable>
            }
        </View>
    )
}