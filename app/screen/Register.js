
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
    ScrollView,
} from 'react-native';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const REGISTER = gql`
    mutation Register($name: String, $username: String!, $email: String!, $password: String!) {
        register(name: $name, username: $username, email: $email, password: $password) {
            _id
            name
            username
            email
        }
    }
`;

export default function Register({ navigation }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [register, { loading }] = useMutation(REGISTER);

    async function handleRegister() {
        if (
            !name.trim() ||
            !username.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            Alert.alert('Oops!', 'All fields are required.');
            return;
        }

        if (password.length < 5) {
            Alert.alert(
                'Oops!',
                'Password must be at least 5 characters long.'
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Oops!', 'Passwords do not match.');
            return;
        }

        try {
            const { data } = await register({
                variables: {
                    name: name.trim(),
                    username: username.trim(),
                    email: email.trim(),
                    password,
                },
            });

            if (data?.register) {
                Alert.alert(
                    'Register Success!',
                    'Your account has been created successfully. Please log in.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login'),
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert(
                'Register Failed',
                error.message || 'Something went wrong.'
            );
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formContainer}>
                    <Text style={styles.logo}>MySocial</Text>

                    <Text style={styles.subtitle}>
                        Sign up to connect with your friends
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Full name"
                        placeholderTextColor="#999"
                        value={name}
                        onChangeText={setName}
                    />

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
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
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
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm password"
                        placeholderTextColor="#999"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.registerButtonText}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.infoText}>
                        By signing up, you agree to our Terms and Privacy Policy.
                    </Text>
                </View>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>
                        Already have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginLink}> Log in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingTop: 30,
        paddingBottom: 20,
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
        textAlign: 'center',
        marginBottom: 28,
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
    registerButton: {
        width: '100%',
        height: 46,
        backgroundColor: '#3797EF',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    infoText: {
        color: '#999999',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 20,
        paddingHorizontal: 10,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        marginTop: 25,
    },
    loginText: {
        color: '#666666',
        fontSize: 13,
    },
    loginLink: {
        color: '#3797EF',
        fontSize: 13,
        fontWeight: 'bold',
    },
});
