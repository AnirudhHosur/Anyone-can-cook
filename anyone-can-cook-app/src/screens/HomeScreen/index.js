import { Image, StyleSheet, FlatList, View } from 'react-native';
import RestaurantItem from '../../components/RestaurantItem';
import { fetchRestaurants } from '../../services/firebaseServices';
import { useEffect, useState } from 'react';

export default function HomeScreen() {

    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetchRestaurants().then(setRestaurants);
    }, []);

    return (
        <View style={styles.page}>
            <FlatList
                data={restaurants}
                renderItem={({ item }) => <RestaurantItem restaurant={item} />}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: 10
    }
});