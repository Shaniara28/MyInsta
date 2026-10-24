import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screen/Home';
import PostDetail from '../screen/PostDetail';
import Register from '../screen/Register';
import Login from '../screen/Login';
import CreatePost from '../screen/CreatePost';
import Seacrh from '../screen/Search';
import Profile from '../screen/Profile';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Create Post" component={CreatePost} />
            <Stack.Screen name="Post Detail" component={PostDetail} />
            <Stack.Screen name="Search" component={Seacrh} />
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    );
}