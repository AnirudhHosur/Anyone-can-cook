import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../services/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Logged in
                    console.log("User logged in:", userCredential.user);
                    Alert.alert('Login Successful', 'You are now logged in!');
                    navigation.navigate('HomeTabs');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // Handle errors here
                    Alert.alert('Login Failed', errorMessage);
                });
        } else {
            Alert.alert('Input Required', 'Please enter both email and password.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <Text style={styles.signUpText}>
                Not registered?
                <Text style={styles.signUpLink} onPress={() => navigation.navigate('RegisterScreen')}> Sign Up Today</Text>
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
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    signUpText: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
        alignSelf: 'center',
    },
    signUpLink: {
        color: '#0066cc',
        fontWeight: 'bold',
    },
});

export default LoginScreen;