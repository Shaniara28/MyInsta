
import { useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../navigations/BottomNav';

const stories = [
    { id: '1', username: 'your_story', image: 'https://i.pravatar.cc/150?img=12' },
    { id: '2', username: 'jessica', image: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', username: 'michael', image: 'https://i.pravatar.cc/150?img=11' },
    { id: '4', username: 'sarah', image: 'https://i.pravatar.cc/150?img=9' },
    { id: '5', username: 'david', image: 'https://i.pravatar.cc/150?img=13' },
];

const initialPosts = [
    {
        id: '1',
        username: 'jessica',
        profileImage: 'https://i.pravatar.cc/150?img=5',
        postImage: 'https://picsum.photos/id/1011/600/600',
        caption: 'Enjoying the beautiful view today! 🌿',
        likes: 120,
        isLiked: false,
    },
    {
        id: '2',
        username: 'michael',
        profileImage: 'https://i.pravatar.cc/150?img=11',
        postImage: 'https://picsum.photos/id/1015/600/600',
        caption: 'Adventure is always a good idea. 🏔️',
        likes: 85,
        isLiked: false,
    },
];

export default function Home({ navigation }) {
    const [posts, setPosts] = useState(initialPosts);

    function handleLike(postId) {
        setPosts(currentPosts =>
            currentPosts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked
                            ? post.likes - 1
                            : post.likes + 1,
                    };
                }

                return post;
            })
        );
    }

    function renderPost({ item }) {
        return (
            <View style={styles.post}>
                <View style={styles.postHeader}>
                    <Image
                        source={{ uri: item.profileImage }}
                        style={styles.profileImage}
                    />

                    <Text style={styles.username}>{item.username}</Text>

                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-horizontal" size={22} color="#222" />
                    </TouchableOpacity>
                </View>

                <Image
                    source={{ uri: item.postImage }}
                    style={styles.postImage}
                    resizeMode="cover"
                />

                <View style={styles.postActions}>
                    <TouchableOpacity onPress={() => handleLike(item.id)}>
                        <Ionicons
                            name={item.isLiked ? 'heart' : 'heart-outline'}
                            size={27}
                            color={item.isLiked ? '#E63946' : '#222'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            navigation.navigate('PostDetail', { post: item })
                        }>
                        <Ionicons name="chatbubble-outline" size={25} color="#222" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="paper-plane-outline" size={25} color="#222" />
                    </TouchableOpacity>

                    <View style={styles.spacer} />

                    <TouchableOpacity>
                        <Ionicons name="bookmark-outline" size={25} color="#222" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.likes}>{item.likes} likes</Text>

                <Text style={styles.caption}>
                    <Text style={styles.username}>{item.username} </Text>
                    {item.caption}
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('PostDetail', { post: item })
                    }>
                    <Text style={styles.viewComments}>View all comments</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>MyInsta</Text>

                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
                        <Ionicons name="add-circle-outline" size={28} color="#222" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons name="heart-outline" size={27} color="#222" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="paper-plane-outline" size={26} color="#222" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stories */}
            <View style={styles.storiesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {stories.map(story => (
                        <TouchableOpacity key={story.id} style={styles.story}>
                            <View style={styles.storyBorder}>
                                <Image
                                    source={{ uri: story.image }}
                                    style={styles.storyImage}
                                />
                            </View>

                            <Text style={styles.storyUsername} numberOfLines={1}>
                                {story.username}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Feed */}
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            />

            {/* Bottom Navigation */}
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
        height: 60,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#DDDDDD',
    },
    logo: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#262626',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginHorizontal: 16,
    },
    storiesContainer: {
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#DDDDDD',
    },
    story: {
        width: 76,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    storyBorder: {
        width: 62,
        height: 62,
        borderRadius: 31,
        borderWidth: 2,
        borderColor: '#E1306C',
        padding: 3,
    },
    storyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    storyUsername: {
        fontSize: 11,
        color: '#333333',
        marginTop: 5,
    },
    post: {
        marginBottom: 18,
    },
    postHeader: {
        height: 55,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 18,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
        color: '#262626',
    },
    moreButton: {
        marginLeft: 'auto',
        padding: 5,
    },
    postImage: {
        width: '100%',
        height: 350,
        backgroundColor: '#EEEEEE',
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    actionButton: {
        marginLeft: 16,
    },
    spacer: {
        flex: 1,
    },
    likes: {
        fontWeight: 'bold',
        marginHorizontal: 12,
        marginTop: 8,
        color: '#262626',
    },
    caption: {
        marginHorizontal: 12,
        marginTop: 5,
        color: '#262626',
    },
    viewComments: {
        marginHorizontal: 12,
        marginTop: 5,
        color: '#888888',
        fontSize: 13,
    }
});
