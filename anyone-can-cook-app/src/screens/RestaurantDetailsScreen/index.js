import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'
//import Ionicons from "react-native-vector-icons/Ionicons";
import { Ionicons } from '@expo/vector-icons';
import DishListItem from '../../components/DishListItem';
import styles from './styles';
import RestaurantHeader from './header';

const restaurant = restaurants[0]

export const RestaurantDetailsScreen = () => {
    return (
        <View style={styles.page}>
            <FlatList
                data={restaurant.dishes}
                renderItem={({ item }) => <DishListItem dish={item} />}
                ListHeaderComponent={() => <RestaurantHeader restaurant={restaurant} />}
            />

            <Ionicons
                name="arrow-back-circle"
                size={40}
                color="white"
                style={styles.iconContainer}
            />
        </View>
    )
}