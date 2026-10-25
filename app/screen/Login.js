
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
    ActivityIndicator
} from 'react-native';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '../context/AuthContext';

const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            message
            token
        }
    }
`;

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();

    const [login] = useMutation(LOGIN);

    async function handleLogin() {
        if (!username.trim() || !password) {
            Alert.alert(
                'Oops!',
                'Username and password are required!'
            );
            return;
        }

        try {
            setLoading(true);

            const { data } = await login({
                variables: {
                    username: username.trim(),
                    password,
                },
            });

            const token = data?.login?.token;

            if (!token) {
                Alert.alert('Login Failed', 'Token was not received.');
                return;
            }

            await signIn(token);

        } catch (error) {
            Alert.alert(
                'Login Failed',
                error.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
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
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.loginButtonText}>Log In</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                    Don't have an account?
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerLink}> Sign up</Text>
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        marginTop: 35,
        paddingBottom: 50,
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
