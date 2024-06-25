import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../services/config'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../navigation/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [transportationMode, setTransportationMode] = useState('');

    const navigation = useNavigation();

    const { uid, dbCourier, setDbCourier, logOut } = useContext(AuthContext);

    useEffect(() => {
        if (dbCourier) {
            setFirstName(dbCourier.firstName || '');
            setLastName(dbCourier.lastName || '');
            setTransportationMode(dbCourier.transportationMode || '');
        }
    }, [dbCourier]);

    const onSave = async () => {
        if (dbCourier) {
            await updateCourier();
        } else {
            await createCourier();
        }
        // navigation.goBack();
    };

    const updateCourier = async () => {
        if (!uid) {
            Alert.alert("Error", "No courier ID found");
            return;
        }

        if (transportationMode.trim() === '') {
            Alert.alert("Invalid Input", "Please enter your transportation mode.");
            return;
        }

        const updatedData = {
            firstName,
            lastName,
            transportationMode
        };

        const hasChanges = Object.keys(updatedData).some(key => dbCourier[key] !== updatedData[key]);

        if (hasChanges) {
            try {
                await setDoc(doc(db, "courier", uid), updatedData, { merge: true });
                setDbCourier(updatedData);
                Alert.alert("Success", "Profile updated successfully!");
            } catch (error) {
                console.error("Error updating document: ", error);
                Alert.alert("Error", "There was a problem updating your profile.");
            }
        } else {
            Alert.alert("Info", "No changes to update.");
        }
    };

    const createCourier = async () => {
        if (!uid) {
            Alert.alert("Error", "No courier ID found");
            return;
        }

        if (isNaN(transportationMode)) {
            Alert.alert("Invalid Input", "Please enter your transportation mode.");
            return;
        }

        const courierData = {
            id: uid,
            firstName,
            lastName,
            transportationMode
        };

        try {
            await setDoc(doc(db, "courier", uid), courierData);
            setDbCourier(courierData);
            Alert.alert("Success", "Profile saved successfully!");
        } catch (error) {
            console.error("Error saving document: ", error);
            Alert.alert("Error", "There was a problem saving your profile.");
        }
    }

    const handleSignOut = async () => {
        try {
            await logOut();
            Alert.alert('Logged out successfully!')
        } catch (error) {
            console.error('Error logging out', error);
            Alert.alert('Error', error.message);
        }
    }

    return (
        <SafeAreaView>
            <Text style={styles.title}>Profile</Text>
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
                value={transportationMode}
                onChangeText={setTransportationMode}
                placeholder="Transportation Mode"
                style={styles.input}
            />

            <Button onPress={onSave} title="Save" />
            <Text
                onPress={handleSignOut}
                style={{ textAlign: "center", color: "red", margin: 10 }}
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
