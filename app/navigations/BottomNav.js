
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav() {
    const navigation = useNavigation();

    return (
        <View style={styles.bottomNavigation}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Ionicons name="home" size={26} color="#222" />
            </TouchableOpacity>

            <TouchableOpacity>
                <Ionicons name="search-outline" size={26} color="#222" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('CreatePost')}
            >
                <Ionicons name="add-circle-outline" size={28} color="#222" />
            </TouchableOpacity>

            <TouchableOpacity>
                <Ionicons name="heart-outline" size={26} color="#222" />
            </TouchableOpacity>

            <TouchableOpacity>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                    style={styles.bottomProfile}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNavigation: {
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 0.5,
        borderTopColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
    },
    bottomProfile: {
        width: 27,
        height: 27,
        borderRadius: 14,
    },
});
