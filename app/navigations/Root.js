
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../context/AuthContext';

import Home from '../screen/Home';
import PostDetail from '../screen/PostDetail';
import Register from '../screen/Register';
import Login from '../screen/Login';
import CreatePost from '../screen/CreatePost';
import Seacrh from '../screen/Search';
import Profile from '../screen/Profile';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    const { isSignedIn, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator>
            {!isSignedIn ? (
                <>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{ headerShown: false }}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="CreatePost"
                        component={CreatePost}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="PostDetail"
                        component={PostDetail}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Search"
                        component={Seacrh}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                        options={{ headerShown: false }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}
