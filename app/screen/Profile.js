
import { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../navigations/BottomNav';

const initialPosts = [
    {
        id: '1',
        username: 'Shania',
        profileImage: 'https://i.pravatar.cc/150?img=12',
        postImage: 'https://picsum.photos/id/1011/600/600',
        caption: 'Enjoying the beautiful view! 🌿',
        likes: 24,
        isLiked: false,
    },
    {
        id: '2',
        username: 'Bintang',
        profileImage: 'https://i.pravatar.cc/150?img=12',
        postImage: 'https://picsum.photos/id/1015/600/600',
        caption: 'A little adventure. 🏔️',
        likes: 35,
        isLiked: false,
    },
    {
        id: '3',
        username: 'Rafi',
        profileImage: 'https://i.pravatar.cc/150?img=12',
        postImage: 'https://picsum.photos/id/1016/600/600',
        caption: 'Beautiful nature.',
        likes: 18,
        isLiked: false,
    },
];

export default function Profile({ navigation }) {
    const [posts] = useState(initialPosts);

    const username = 'Shaniara28';
    const fullName = 'Shania Risky Agustin';
    const bio = 'Sharing my moments ✨\nWelcome to my profile!';

    function handleEditProfile() {
        Alert.alert(
            'Edit Profile',
            'The edit profile feature is coming soon.'
        );
    }

    function handleSettings() {
        Alert.alert(
            'Settings',
            'The settings feature is coming soon.'
        );
    }

    function openPost(item) {
        navigation.navigate('PostDetail', { post: item });
    }

    function renderPost({ item }) {
        return (
            <TouchableOpacity
                style={styles.gridItem}
                onPress={() => openPost(item)}
                activeOpacity={0.8}
            >
                <Image
                    source={{
                        uri: item.postImage || item.imgUrl,
                    }}
                    style={styles.gridImage}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerUsername}>{username}</Text>

                <TouchableOpacity onPress={handleSettings}>
                    <Ionicons
                        name="menu-outline"
                        size={29}
                        color="#262626"
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View>
                        {/* Profile Information */}
                        <View style={styles.profileInfo}>
                            <Image
                                source={{
                                    uri: 'https://i.pravatar.cc/150?img=12',
                                }}
                                style={styles.avatar}
                            />

                            <View style={styles.statistics}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>
                                        {posts.length}
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Posts
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>128</Text>
                                    <Text style={styles.statLabel}>
                                        Followers
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>96</Text>
                                    <Text style={styles.statLabel}>
                                        Following
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Bio */}
                        <View style={styles.bioContainer}>
                            <Text style={styles.fullName}>{fullName}</Text>
                            <Text style={styles.bio}>{bio}</Text>
                        </View>

                        {/* Edit Profile Button */}
                        <View style={styles.profileButtons}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditProfile}
                            >
                                <Text style={styles.editButtonText}>
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={() =>
                                    Alert.alert(
                                        'Share Profile',
                                        'Profile sharing is coming soon.'
                                    )
                                }
                            >
                                <Text style={styles.editButtonText}>
                                    Share Profile
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Posts Tab */}
                        <View style={styles.tabs}>
                            <Ionicons
                                name="grid-outline"
                                size={25}
                                color="#262626"
                            />
                        </View>

                        {posts.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name="images-outline"
                                    size={45}
                                    color="#888888"
                                />
                                <Text style={styles.emptyTitle}>
                                    No Posts Yet
                                </Text>
                            </View>
                        )}
                    </View>
                }
            />
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 40
    },
    header: {
        height: 55,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#DDDDDD',
    },
    headerUsername: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#262626',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingTop: 20,
    },
    avatar: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: '#EEEEEE',
    },
    statistics: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginLeft: 12,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#262626',
    },
    statLabel: {
        fontSize: 13,
        color: '#333333',
        marginTop: 4,
    },
    bioContainer: {
        paddingHorizontal: 18,
        marginTop: 16,
    },
    fullName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#262626',
    },
    bio: {
        fontSize: 14,
        lineHeight: 20,
        color: '#262626',
        marginTop: 4,
    },
    profileButtons: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        gap: 8,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        borderRadius: 7,
        alignItems: 'center',
        paddingVertical: 9,
    },
    shareButton: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        borderRadius: 7,
        alignItems: 'center',
        paddingVertical: 9,
    },
    editButtonText: {
        color: '#262626',
        fontSize: 13,
        fontWeight: 'bold',
    },
    tabs: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#DDDDDD',
        marginTop: 12,
    },
    gridItem: {
        width: '33.3333%',
        aspectRatio: 1,
        padding: 1,
    },
    gridImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#EEEEEE',
    },
    listContent: {
        paddingBottom: 15,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 30,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#262626',
    },
});
