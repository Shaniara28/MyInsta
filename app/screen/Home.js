
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
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import BottomNav from '../navigations/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';

const GET_POSTS = gql`
    query GetPosts {
        getPosts {
            _id
            content
            tags
            imgUrl
            authorId
            author {
                _id
                name
                username
            }
            comments {
                content
                createdAt
                updatedAt
                username
            }
            likes {
                createdAt
                updatedAt
                username
            }
            likeCount
            createdAt
            updatedAt
        }
    }
`;

const stories = [
    { id: '1', username: 'your_story', image: 'https://i.pravatar.cc/150?img=12' },
    { id: '2', username: 'jessica', image: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', username: 'michael', image: 'https://i.pravatar.cc/150?img=11' },
    { id: '4', username: 'sarah', image: 'https://i.pravatar.cc/150?img=9' },
    { id: '5', username: 'david', image: 'https://i.pravatar.cc/150?img=13' },
];

export default function Home({ navigation }) {
    const { loading, error, data } = useQuery(GET_POSTS);

    const [likedPosts, setLikedPosts] = useState({});

    const posts = data?.getPosts || [];

    function handleLike(postId) {
        setLikedPosts(current => ({
            ...current,
            [postId]: !current[postId],
        }));
    }

    function renderPost({ item }) {
        const postId = item._id;
        const username = item.author?.username || 'Unknown user';
        const isLiked = !!likedPosts[postId];
        const totalLikes = item.likeCount ?? item.likes?.length ?? 0;
        const displayedLikes = totalLikes + (isLiked ? 1 : 0);

        return (
            <View style={styles.post}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                    <Image
                        source={{
                            uri: 'https://i.pravatar.cc/150?img=12',
                        }}
                        style={styles.profileImage}
                    />

                    <Text style={styles.username}>{username}</Text>

                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons
                            name="ellipsis-horizontal"
                            size={22}
                            color="#222"
                        />
                    </TouchableOpacity>
                </View>

                {/* Post Image */}
                {item.imgUrl ? (
                    <Image
                        source={{ uri: item.imgUrl }}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.postImage, styles.noImage]}>
                        <Ionicons
                            name="image-outline"
                            size={45}
                            color="#888"
                        />
                        <Text style={styles.noImageText}>
                            No image available
                        </Text>
                    </View>
                )}

                {/* Post Actions */}
                <View style={styles.postActions}>
                    <TouchableOpacity onPress={() => handleLike(postId)}>
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            size={27}
                            color={isLiked ? '#E63946' : '#222'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            navigation.navigate('PostDetail', {
                                post: item,
                            })
                        }
                    >
                        <Ionicons
                            name="chatbubble-outline"
                            size={25}
                            color="#222"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                            name="paper-plane-outline"
                            size={25}
                            color="#222"
                        />
                    </TouchableOpacity>

                    <View style={styles.spacer} />

                    <TouchableOpacity>
                        <Ionicons
                            name="bookmark-outline"
                            size={25}
                            color="#222"
                        />
                    </TouchableOpacity>
                </View>

                {/* Likes */}
                <Text style={styles.likes}>
                    {displayedLikes} likes
                </Text>

                {/* Caption */}
                <Text style={styles.caption}>
                    <Text style={styles.username}>{username} </Text>
                    {item.content}
                </Text>

                {/* Comments */}
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('PostDetail', {
                            post: item,
                        })
                    }
                >
                    <Text style={styles.viewComments}>
                        View all comments ({item.comments?.length || 0})
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>MyInsta</Text>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CreatePost')}
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={28}
                            color="#222"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons
                            name="heart-outline"
                            size={27}
                            color="#222"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons
                            name="paper-plane-outline"
                            size={26}
                            color="#222"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stories */}
            <View style={styles.storiesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {stories.map(story => (
                        <TouchableOpacity
                            key={story.id}
                            style={styles.story}
                        >
                            <View style={styles.storyBorder}>
                                <Image
                                    source={{ uri: story.image }}
                                    style={styles.storyImage}
                                />
                            </View>

                            <Text
                                style={styles.storyUsername}
                                numberOfLines={1}
                            >
                                {story.username}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Loading */}
            {loading && (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        Loading posts...
                    </Text>
                </View>
            )}

            {/* Error */}
            {error && (
                <View style={styles.messageContainer}>
                    <Text style={styles.errorText}>
                        Failed to load posts.
                    </Text>
                    <Text style={styles.messageText}>
                        {error.message}
                    </Text>
                </View>
            )}

            {/* Posts from MongoDB */}
            {!loading && !error && (
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={item => item._id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.messageContainer}>
                            <Text style={styles.messageText}>
                                No posts available.
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Bottom Navigation */}
            <BottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 40,
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
    noImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        marginTop: 5,
        color: '#888888',
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
    },
    messageContainer: {
        alignItems: 'center',
        padding: 20,
    },
    messageText: {
        color: '#666666',
        textAlign: 'center',
        marginTop: 5,
    },
    errorText: {
        color: '#E63946',
        fontWeight: 'bold',
    },
});
