import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../services/config'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {

    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                    setAddress(userData.address);
                    setLat(userData.lat?.toString());
                    setLng(userData.lng?.toString());
                }
                setUser(user);
            }
        };
        fetchUserProfile();
    }, []);

    const onSave = async () => {
        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    firstName,
                    lastName,
                    address,
                    lat: parseFloat(lat),
                    lng: parseFloat(lng)
                }, { merge: true });
                Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    style={styles.input}
                />
                <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    style={styles.input}
                />
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Address"
                    style={styles.input}
                />
                <TextInput
                    value={lat}
                    onChangeText={setLat}
                    placeholder="Latitude"
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    value={lng}
                    onChangeText={setLng}
                    placeholder="Longitude"
                    keyboardType="numeric"
                    style={styles.input}
                />
            </View>
            <Button onPress={onSave} title="Save" />
            <Text
                onPress={() => {
                    auth.signOut();
                    Alert.alert('Log out Successful', 'You have successfully logged out!');
                    navigation.navigate('LoginScreen');
                }}
                style={styles.signOut}
            >
                Sign out
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    signOut: {
        textAlign: 'center',
        color: 'red',
        marginTop: 20,
        fontSize: 16,
    }
});

export default ProfileScreen;