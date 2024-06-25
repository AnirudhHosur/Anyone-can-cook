import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { AuthContext } from '../../navigation/AuthContext';

const SignUpScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { signUp } = useContext(AuthContext);

    const handleSignUp = async () => {
        try {
            await signUp(email, password, firstName, lastName, phoneNumber);
            Alert.alert('Courier created successfully')
        } catch (error) {
            console.error('Error creating user', error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <Pressable style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signInText}>Already have an account? Sign In</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#3FC060',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 12,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInText: {
        marginTop: 12,
        color: '#3FC060',
        fontSize: 16,
    },
});

export default SignUpScreen;