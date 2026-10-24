
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../navigations/BottomNav';

const initialPosts = [
    {
        id: '1',
        username: 'jessica',
        profileImage: 'https://i.pravatar.cc/150?img=5',
        postImage: 'https://picsum.photos/id/1011/600/600',
        caption: 'Enjoying the beautiful view today!',
        likes: 120,
        isLiked: false,
    },
    {
        id: '2',
        username: 'michael',
        profileImage: 'https://i.pravatar.cc/150?img=11',
        postImage: 'https://picsum.photos/id/1015/600/600',
        caption: 'Adventure is always a good idea.',
        likes: 85,
        isLiked: false,
    },
    {
        id: '3',
        username: 'sarah',
        profileImage: 'https://i.pravatar.cc/150?img=9',
        postImage: 'https://picsum.photos/id/1016/600/600',
        caption: 'Nature makes me happy.',
        likes: 200,
        isLiked: false,
    },
    {
        id: '4',
        username: 'david',
        profileImage: 'https://i.pravatar.cc/150?img=13',
        postImage: 'https://picsum.photos/id/1020/600/600',
        caption: 'Weekend getaway!',
        likes: 95,
        isLiked: false,
    },
    {
        id: '5',
        username: 'jessica',
        profileImage: 'https://i.pravatar.cc/150?img=5',
        postImage: 'https://picsum.photos/id/1024/600/600',
        caption: 'A lovely day with friends.',
        likes: 150,
        isLiked: false,
    },
    {
        id: '6',
        username: 'michael',
        profileImage: 'https://i.pravatar.cc/150?img=11',
        postImage: 'https://picsum.photos/id/1035/600/600',
        caption: 'Exploring somewhere new.',
        likes: 75,
        isLiked: false,
    },
];

export default function Search({ navigation }) {
    const [searchText, setSearchText] = useState('');

    const filteredPosts = initialPosts.filter(post => {
        const username = post.username.toLowerCase();
        const caption = (post.caption || post.content || '').toLowerCase();
        const keyword = searchText.toLowerCase().trim();

        return (
            username.includes(keyword) ||
            caption.includes(keyword)
        );
    });

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

                <View style={styles.likesOverlay}>
                    <Ionicons name="heart" size={14} color="#FFFFFF" />
                    <Text style={styles.likesText}>{item.likes}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons
                    name="search-outline"
                    size={22}
                    color="#888888"
                />

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search usernames..."
                    placeholderTextColor="#888888"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCapitalize="none"
                    returnKeyType="search"
                />

                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color="#888888"
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Search Results */}
            {filteredPosts.length > 0 ? (
                <FlatList
                    key="search-grid"
                    data={filteredPosts}
                    renderItem={renderPost}
                    keyExtractor={item => item.id}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.gridContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="search-outline"
                        size={50}
                        color="#AAAAAA"
                    />

                    <Text style={styles.emptyTitle}>
                        No results found
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        Try searching for another username or caption.
                    </Text>
                </View>
            )}

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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#DDDDDD'
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#262626',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        margin: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#262626',
    },
    gridContainer: {
        paddingBottom: 10,
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
    likesOverlay: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    likesText: {
        color: '#FFFFFF',
        fontSize: 11,
        marginLeft: 3,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#262626',
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
        marginTop: 6,
    },
});
