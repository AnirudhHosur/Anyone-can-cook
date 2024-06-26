import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import styles from './styles';

const RestaurantHeader = ({ restaurant }) => {
    return (
        <View style={styles.page}>
            <Image
                source={{ uri: restaurant.image }}
                style={styles.image}
                resizeMode='cover'
            />

            <View style={styles.container}>
                <Text style={styles.title}>{restaurant.name}</Text>
                <Text style={styles.subtitle}>
                    ${restaurant.deliveryFee.toFixed(2)} delivery • {restaurant.minDeliveryTime}-{restaurant.maxDeliveryTime} minutes
                </Text>

                <Text style={styles.menuTitle}>Menu</Text>
            </View>
        </View>
    )
}

export default RestaurantHeader;