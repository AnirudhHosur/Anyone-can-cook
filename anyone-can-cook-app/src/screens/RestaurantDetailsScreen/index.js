import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DishListItem from '../../components/DishListItem';
import styles from './styles';
import RestaurantHeader from './header';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchRestaurants, fetchDishes } from '../../services/firebaseServices';
import { useEffect, useState } from 'react';

export const RestaurantDetailsScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { restaurantId } = route.params;

    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        const getRestaurantDetails = async () => {
            const allRestaurants = await fetchRestaurants();
            const foundRestaurant = allRestaurants.find(r => r.id === restaurantId);
            if (foundRestaurant) {
                setRestaurant(foundRestaurant);
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
        </View>
    )
}