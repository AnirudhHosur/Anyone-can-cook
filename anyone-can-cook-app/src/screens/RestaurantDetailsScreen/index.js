import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View, ActivityIndicator } from 'react-native';
import DishListItem from '../../components/DishListItem';
import { useBasketContext } from '../../navigation/BasketContext';
import { fetchDishes, fetchRestaurants } from '../../services/firebaseServices';
import RestaurantHeader from './header';
import styles from './styles';

export const RestaurantDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { restaurantId } = route.params;

    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    const { setRestaurant: setBasketRestaurant, basket, basketDishes } = useBasketContext();

    useEffect(() => {
        const getRestaurantDetails = async () => {
            setBasketRestaurant(null);
            setLoading(true);
            const allRestaurants = await fetchRestaurants();
            const foundRestaurant = allRestaurants.find(r => r.id === restaurantId);
            if (foundRestaurant) {
                setRestaurant(foundRestaurant);
                setBasketRestaurant(foundRestaurant);
                const fetchedDishes = await fetchDishes(restaurantId);
                setDishes(fetchedDishes);
            }
            setLoading(false);
        }

        getRestaurantDetails();
    }, [restaurantId]);

    if (loading) {
        return (
            <View style={[styles.page, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
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
            {basket && (
                <Pressable onPress={() => navigation.navigate("Basket")} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Open Basket • ({basketDishes.length})
                    </Text>
                </Pressable>
            )}
        </View>
    );
}