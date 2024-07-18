import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../services/config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../navigation/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const navigation = useNavigation();
    const { uid, dbUser, setDbUser } = useAuthContext();

    useEffect(() => {
        if (dbUser) {
            setFirstName(dbUser.firstName || '');
            setLastName(dbUser.lastName || '');
            setAddress(dbUser.address || '');
            setLat(dbUser.lat ? String(dbUser.lat) : '');
            setLng(dbUser.lng ? String(dbUser.lng) : '');
        }
    }, [dbUser]);

    const onSave = async () => {
        if (dbUser) {
            await updateUser();
        } else {
            await createUser();
        }
        navigation.goBack();
    };

    const updateUser = async () => {
        if (!uid) {
            Alert.alert("Error", "No user ID found");
            return;
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        if (isNaN(latitude) || isNaN(longitude)) {
            Alert.alert("Invalid Input", "Please enter valid latitude and longitude values.");
            return;
        }

        const updatedData = {
            firstName,
            lastName,
            address,
            lat: latitude,
            lng: longitude,
        };

        const hasChanges = Object.keys(updatedData).some((key) => dbUser[key] !== updatedData[key]);

        if (hasChanges) {
            try {
                await setDoc(doc(db, "users", uid), updatedData, { merge: true });
                setDbUser(updatedData);
                Alert.alert("Success", "Profile updated successfully!");
            } catch (error) {
                console.error("Error updating document: ", error);
                Alert.alert("Error", "There was a problem updating your profile.");
            }
        } else {
            Alert.alert("Info", "No changes to update.");
        }
    };

    const createUser = async () => {
        if (!uid) {
            Alert.alert("Error", "No user ID found");
            return;
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        if (isNaN(latitude) || isNaN(longitude)) {
            Alert.alert("Invalid Input", "Please enter valid latitude and longitude values.");
            return;
        }

        const userData = {
            id: uid,
            firstName,
            lastName,
            address,
            lat: latitude,
            lng: longitude,
        };

        try {
            await setDoc(doc(db, "users", uid), userData);
            setDbUser(userData);
            Alert.alert("Success", "Profile saved successfully!");
        } catch (error) {
            console.error("Error saving document: ", error);
            Alert.alert("Error", "There was a problem saving your profile.");
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
            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    auth.signOut();
                    Alert.alert('Log out Successful', 'You have successfully logged out!');
                    navigation.navigate('LoginScreen');
                }}
                style={styles.signOutButton}
            >
                <Text style={styles.signOutButtonText}>Sign out</Text>
                <Ionicons name="log-out-outline" size={20} color="red" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    signOutButtonText: {
        color: 'red',
        fontSize: 16,
        marginRight: 5,
    },
});

export default ProfileScreen;