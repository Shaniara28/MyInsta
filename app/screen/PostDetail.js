import { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { SafeAreaView } from 'react-native-safe-area-context';

const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    getPostById(id: $id) {
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
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      likeCount
      createdAt
      updatedAt
    }
  }
`;

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
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      likeCount
      createdAt
      updatedAt
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      content
      username
      createdAt
      updatedAt
    }
  }
`;

const ADD_LIKE = gql`
  mutation AddLike($postId: ID!) {
    addLike(postId: $postId) {
      _id
      likeCount
      likes {
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export default function PostDetail({ route, navigation }) {
    const postId = route.params?.id || route.params?.post?._id;

    const { loading, error, data, refetch } = useQuery(
        GET_POST_BY_ID,
        {
            variables: { id: postId },
            skip: !postId,
            fetchPolicy: "network-only",
        }
    );

    const [addComment, { loading: commentLoading }] = useMutation(
        ADD_COMMENT,
        {
            refetchQueries: [{ query: GET_POSTS }],
            awaitRefetchQueries: true,
            onError: (err) => {
                Alert.alert("Failed", err.message || "Failed to add comment.");
            },
        }
    );

    const [addLike, { loading: likeLoading }] = useMutation(
        ADD_LIKE,
        {
            refetchQueries: [{ query: GET_POSTS }],
            awaitRefetchQueries: true,
            onError: (err) => {
                Alert.alert("Failed", err.message || "Failed to like post.");
            },
        }
    );

    const post = data?.getPostById;

    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (post) {
            setLikes(post.likeCount ?? post.likes?.length ?? 0);
            setComments(post.comments || []);
        }
    }, [post]);

    useEffect(() => {
        if (error) {
            Alert.alert(
                "Failed to Load Post",
                error.message || "Something went wrong."
            );
        }
    }, [error]);

    async function handleLike() {
        if (likeLoading) return;

        try {
            const result = await addLike({
                variables: { postId },
            });

            const updatedPost = result.data?.addLike;

            if (updatedPost) {
                setLikes(
                    updatedPost.likeCount ?? updatedPost.likes?.length ?? 0
                );

                await refetch();
            }
        } catch (err) {
            console.log("Like error:", err.message);
        }
    }

    async function handleComment() {
        const trimmedComment = comment.trim();

        if (!trimmedComment || !postId || commentLoading) {
            return;
        }

        try {
            await addComment({
                variables: {
                    postId,
                    content: trimmedComment,
                },
            });

            setComment("");

            await refetch();
        } catch (err) {
            console.log("Comment error:", err.message);
        }
    }

    if (loading) {
        return (
            <View style={styles.emptyContainer}>
                <ActivityIndicator size="large" color="#3797EF" />
                <Text style={styles.loadingText}>Loading post...</Text>
            </View>
        );
    }

    if (!post) {
        return (
            <View style={styles.emptyContainer}>
                <Text>
                    {error ? "Failed to load post." : "Post not found."}
                </Text>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#222" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Post Detail</Text>

                <View style={styles.headerSpace} />
            </View>

            <FlatList
                data={comments}
                keyExtractor={(item, index) =>
                    `${item.username || "user"}-${item.createdAt || index}-${index}`
                }
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <Text style={styles.commentUsername}>
                            {item.username || "Unknown"}{" "}
                        </Text>

                        <Text style={styles.commentContent}>
                            {item.content}
                        </Text>
                    </View>
                )}
                ListHeaderComponent={
                    <View>
                        <View style={styles.userInfo}>
                            <Image
                                source={{
                                    uri: "https://i.pravatar.cc/150?img=12",
                                }}
                                style={styles.profileImage}
                            />

                            <View>
                                <Text style={styles.username}>
                                    {post.author?.username || "Unknown user"}
                                </Text>

                                {post.author?.name ? (
                                    <Text style={styles.authorName}>
                                        {post.author.name}
                                    </Text>
                                ) : null}
                            </View>
                        </View>

                        {post.imgUrl ? (
                            <Image
                                source={{ uri: post.imgUrl }}
                                style={styles.postImage}
                                resizeMode="cover"
                            />
                        ) : null}

                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={handleLike}
                                disabled={likeLoading}
                            >
                                {likeLoading ? (
                                    <ActivityIndicator size="small" color="#E63946" />
                                ) : (
                                    <Ionicons
                                        name={isLiked ? "heart" : "heart-outline"}
                                        size={28}
                                        color={isLiked ? "#E63946" : "#222"}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionIcon}
                                onPress={() => { }}
                            >
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={26}
                                    color="#222"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionIcon}>
                                <Ionicons
                                    name="paper-plane-outline"
                                    size={26}
                                    color="#222"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.likes}>{likes} likes</Text>

                        <View style={styles.captionContainer}>
                            <Text style={styles.username}>
                                {post.author?.username || "Unknown user"}{" "}
                            </Text>

                            <Text style={styles.caption}>{post.content || ""}</Text>
                        </View>

                        {post.tags?.length > 0 && (
                            <Text style={styles.tags}>
                                {post.tags.map((tag) => `#${tag}`).join(" ")}
                            </Text>
                        )}

                        <View style={styles.divider} />

                        <Text style={styles.commentsTitle}>
                            Comments ({comments.length})
                        </Text>

                        {comments.length === 0 && (
                            <Text style={styles.emptyComments}>
                                No comments yet. Be the first to comment!
                            </Text>
                        )}
                    </View>
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />

            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Write a comment..."
                    placeholderTextColor="#888"
                    value={comment}
                    onChangeText={setComment}
                    onSubmitEditing={handleComment}
                    returnKeyType="send"
                    editable={!commentLoading}
                />

                <TouchableOpacity
                    onPress={handleComment}
                    disabled={!comment.trim() || commentLoading}
                >
                    {commentLoading ? (
                        <ActivityIndicator size="small" color="#0095F6" />
                    ) : (
                        <Text
                            style={[
                                styles.postButton,
                                !comment.trim() && styles.disabledButton,
                            ]}
                        >
                            Post
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 40,
    },
    header: {
        height: 55,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#262626",
    },
    headerSpace: {
        width: 26,
    },
    userInfo: {
        minHeight: 55,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    username: {
        fontWeight: "bold",
        color: "#262626",
    },
    authorName: {
        color: "#777777",
        fontSize: 12,
        marginTop: 2,
    },
    postImage: {
        width: "100%",
        height: 350,
        backgroundColor: "#EEEEEE",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingTop: 12,
    },
    actionIcon: {
        marginLeft: 18,
    },
    likes: {
        fontWeight: "bold",
        marginHorizontal: 14,
        marginTop: 8,
        color: "#262626",
    },
    captionContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: 14,
        marginTop: 8,
        marginBottom: 12,
    },
    caption: {
        color: "#262626",
        flexShrink: 1,
    },
    tags: {
        color: "#3797EF",
        marginHorizontal: 14,
        marginBottom: 16,
    },
    divider: {
        height: 0.5,
        backgroundColor: "#DDDDDD",
    },
    commentsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#262626",
        margin: 14,
    },
    emptyComments: {
        color: "#888888",
        marginHorizontal: 14,
        marginBottom: 18,
    },
    commentItem: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    commentUsername: {
        fontWeight: "bold",
        color: "#262626",
    },
    commentContent: {
        color: "#333333",
        flexShrink: 1,
    },
    listContent: {
        paddingBottom: 15,
    },
    commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderTopColor: "#DDDDDD",
        backgroundColor: "#FFFFFF",
    },
    commentInput: {
        flex: 1,
        minHeight: 42,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 22,
        paddingHorizontal: 15,
        color: "#262626",
        marginRight: 12,
    },
    postButton: {
        color: "#0095F6",
        fontWeight: "bold",
        fontSize: 15,
    },
    disabledButton: {
        color: "#AAAAAA",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    loadingText: {
        marginTop: 10,
        color: "#777777",
    },
    backText: {
        color: "#0095F6",
        marginTop: 10,
    },
});