import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'
//import Ionicons from "react-native-vector-icons/Ionicons";
import { Ionicons } from '@expo/vector-icons';
import DishListItem from '../../components/DishListItem';
import styles from './styles';
import RestaurantHeader from './header';
import { useRoute, useNavigation } from '@react-navigation/native';

export const RestaurantDetailsScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params

    // Find the restaurant by id
    const restaurant = restaurants.find((rest) => rest.id === id);

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
                data={restaurant.dishes}
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