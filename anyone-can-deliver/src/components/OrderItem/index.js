import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/config';

const OrderItem = ({ order }) => {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', order.userId));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                } else {
                    console.log('No such user!');
                }
            } catch (error) {
                console.error("Error fetching user details: ", error);
            }
        };

        fetchUserDetails();
    }, [order.userId]);

    return (
        <Pressable style={styles.container} onPress={() => navigation.navigate('OrderDeliveryScreen', { id: order.id })}>
            <View style={{ flexDirection: 'row', margin: 10, borderColor: '#3FC060', borderWidth: 2, borderRadius: 12 }}>
                <Image source={{ uri: order.restaurant?.image || 'https://via.placeholder.com/150' }}
                    style={{ width: '25%', height: '100%', borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }} />

                <View style={{ marginLeft: 10, flex: 1, paddingVertical: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>{order.restaurant?.name || "Unknown Restaurant"}</Text>
                    <Text style={{ color: 'grey' }}>{order.restaurant?.address || "No Address"}</Text>

                    <Text style={{ fontSize: 16, marginTop: 10 }}>Delivery details:</Text>
                    {user ? (
                        <>
                            <Text style={{ color: 'grey' }}>{user.firstName}</Text>
                            <Text style={{ color: 'grey' }}>{user.address}</Text>
                        </>
                    ) : (
                        <Text style={{ color: 'grey' }}>Loading user details...</Text>
                    )}
                </View>

                <View style={{ padding: 5, backgroundColor: '#3FC060', borderBottomRightRadius: 10, borderTopRightRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name='check' size={30} color='white' style={{ marginLeft: 'auto' }} />
                </View>
            </View>

            <StatusBar style="auto" />
        </Pressable>
    );
}

export default OrderItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});