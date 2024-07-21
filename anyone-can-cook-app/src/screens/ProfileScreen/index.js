import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../services/config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../navigation/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY_AUTOCOMPLETE } from '@env';

const ProfileScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const navigation = useNavigation();
    const { authUser, dbUser, setDbUser } = useAuthContext();

    useEffect(() => {
        if (dbUser) {
            setFirstName(dbUser.firstName || '');
            setLastName(dbUser.lastName || '');
            setAddress(dbUser.address || '');
            setLat(dbUser.lat !== null ? String(dbUser.lat) : '');
            setLng(dbUser.lng !== null ? String(dbUser.lng) : '');
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
        if (!authUser.uid) {
            Alert.alert("Error", "No user ID found");
            return;
        }

        const updatedData = {
            id: authUser.uid,
            firstName: firstName || null,
            lastName: lastName || null,
            address: address || null,
            lat: lat ? parseFloat(lat) : null,
            lng: lng ? parseFloat(lng) : null,
        };

        const hasChanges = Object.keys(updatedData).some(
            (key) => dbUser[key] !== updatedData[key]
        );

        if (hasChanges) {
            try {
                await setDoc(doc(db, "users", authUser.uid), updatedData, { merge: true });
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
        if (!authUser.uid) {
            Alert.alert("Error", "No user ID found");
            return;
        }

        const userData = {
            id: authUser.uid,
            firstName: firstName || null,
            lastName: lastName || null,
            address: address || null,
            lat: lat ? parseFloat(lat) : null,
            lng: lng ? parseFloat(lng) : null,
        };

        try {
            await setDoc(doc(db, "users", authUser.uid), userData);
            setDbUser(userData);
            Alert.alert("Success", "Profile saved successfully!");
        } catch (error) {
            console.error("Error saving document: ", error);
            Alert.alert("Error", "There was a problem saving your profile.");
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.inputContainer}>
            {item.type === 'textInput' ? (
                <TextInput
                    value={item.value}
                    onChangeText={item.onChangeText}
                    placeholder={item.placeholder}
                    style={styles.input}
                />
            ) : item.type === 'googleAutocomplete' ? (
                <GooglePlacesAutocomplete
                    placeholder={item.placeholder}
                    fetchDetails
                    onPress={(data, details = null) => {
                        setAddress(data.description);
                        const { lat, lng } = details.geometry.location;
                        setLat(lat.toString());
                        setLng(lng.toString());
                    }}
                    query={{
                        key: GOOGLE_API_KEY_AUTOCOMPLETE,
                        language: 'en',
                    }}
                    styles={{
                        textInput: styles.input,
                        container: styles.autocompleteContainer,
                        listView: styles.autocompleteListView,
                    }}
                />
            ) : null}
        </View>
    );

    const formFields = [
        { type: 'textInput', value: firstName, onChangeText: setFirstName, placeholder: 'First Name' },
        { type: 'textInput', value: lastName, onChangeText: setLastName, placeholder: 'Last Name' },
        { type: 'googleAutocomplete', placeholder: 'Address' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={formFields}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => <Text style={styles.title}>Profile</Text>}
                ListFooterComponent={() => (
                    <View>
                        <TouchableOpacity onPress={onSave} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                auth.signOut();
                                Alert.alert('Log out Successful', 'You have successfully logged out!');
                            }}
                            style={styles.signOutButton}
                        >
                            <Text style={styles.signOutButtonText}>Sign out</Text>
                            <Ionicons name="log-out-outline" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />
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
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    autocompleteContainer: {
        flex: 1,
        zIndex: 1,
    },
    autocompleteListView: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
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