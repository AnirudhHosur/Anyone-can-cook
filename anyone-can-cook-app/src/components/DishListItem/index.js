import { View, StyleSheet, Text, Image } from 'react-native';

const DishListItem = ({ dish }) => {

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{dish.name}</Text>
                <Text style={styles.description} numberOfLines={2}>{dish.description}</Text>
                <Text style={styles.price}>$ {dish.price}</Text>
            </View>
            <View>
                {
                    dish.image && (
                        <Image source={{ uri: dish.image }} style={styles.image} />
                    )
                }
            </View>
        </View>
    )
}

export default DishListItem;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingBottom: 10,
        flexDirection: 'row',
    },

    name: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5
    },

    description: {
        color: 'grey',
        marginVertical: 5
    },

    price: {
        fontSize: 16
    },

    image: {
        height: 70,
        aspectRatio: 1
    }
});