
import { Link } from '@react-navigation/native';
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin() {
        if (!username || !password) {
            Alert.alert('Oops!', 'Username and password is required!');
            return;
        }

        navigation.navigate('Home');
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.formContainer}>
                <Text style={styles.logo}>MyInsta</Text>
                <Text style={styles.subtitle}>
                    Connect with your friends
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                    Don't have an account?
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(
                            'Register',
                            'Register screen akan kita buat berikutnya.'
                        )
                    }
                >
                    <Link screen="Register" style={styles.registerLink}> Sign up</Link>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#262626',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#777777',
        marginBottom: 35,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#DBDBDB',
        borderRadius: 6,
        paddingHorizontal: 14,
        marginBottom: 12,
        fontSize: 14,
        color: '#262626',
    },
    loginButton: {
        width: '100%',
        height: 46,
        backgroundColor: '#3797EF',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginTop: 18,
    },
    forgotText: {
        color: '#385185',
        fontSize: 13,
    },
    registerContainer: {
        fflexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        marginTop: 35,
        paddingBottom: 50
    },
    registerText: {
        color: '#666666',
        fontSize: 13,
    },
    registerLink: {
        color: '#3797EF',
        fontSize: 13,
        fontWeight: 'bold',
    },
});
