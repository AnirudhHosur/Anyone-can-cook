import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../services/config';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '../../navigation/AuthContext';

const RegisterScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signUp } = useAuthContext();

    const navigation = useNavigation();

    // const handleSignUp = () => {
    //     if (email && password && firstName && lastName) {
    //         createUserWithEmailAndPassword(auth, email, password)
    //             .then((userCredential) => {
    //                 // User is created. Now add additional info to Firestore
    //                 const userRef = doc(db, "users", userCredential.user.uid);
    //                 return setDoc(userRef, {
    //                     firstName: firstName,
    //                     lastName: lastName,
    //                     email: email
    //                 });
    //             })
    //             .then(() => {
    //                 Alert.alert('Registration Successful', 'You have registered successfully!');
    //                 navigation.navigate('LoginScreen');
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //                 Alert.alert('Registration Failed', error.message);
    //             });
    //     } else {
    //         Alert.alert('Input Required', 'Please fill all fields.');
    //     }
    // };

    const handleSignUp = async () => {
        try {
            await signUp(email, password, firstName, lastName);
            Alert.alert('Registration Successful', 'You have registered successfully!');
            navigation.navigate('LoginScreen');
        } catch (error) {
            Alert.alert('Registration Failed', error.message);
        }
    };

    const navigateToLogin = () => {
        // navigation logic to login screen
        navigation.navigate('LoginScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#888"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#888"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={styles.signInText}>Already have an account?
                <Text style={styles.signInLink} onPress={navigateToLogin}> Sign In</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        alignSelf: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    signInText: {
        fontSize: 16,
        color: '#333',
        marginTop: 15,
        alignSelf: 'center',
    },
    signInLink: {
        color: '#0066cc',
        fontWeight: 'bold',
    }
});

export default RegisterScreen;