import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../navigation/AuthContext';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user } = useContext(AuthContext);
    const { signIn } = useContext(AuthContext);

    const handleSignIn = async () => {
        try {
            await signIn(email, password);
        } catch (error) {
            console.error('Error signing in', error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <Pressable onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text></Text>
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
        color: '#333',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        fontSize: 16,
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
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpText: {
        marginTop: 12,
        fontSize: 16,
        color: '#333',
    },
    signUpLink: {
        color: '#3FC060',
        fontWeight: 'bold',
    },
});

export default SignInScreen;