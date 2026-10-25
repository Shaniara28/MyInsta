import { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      _id
      name
      username
      email
      followers {
        _id
        name
        username
      }
      following {
        _id
        name
        username
      }
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
      likeCount
      createdAt
      comments {
        content
        username
        createdAt
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      message
      isFollowing
    }
  }
`;

function getUserIdFromToken(token) {
    try {
        if (!token) return null;

        const payload = token.split(".")[1];
        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const decoded = JSON.parse(atob(base64));
        return decoded.id;
    } catch (error) {
        console.log("Failed to read user ID:", error);
        return null;
    }
}

export default function OtherUserProfile({ route, navigation }) {
    const { token } = useAuth();

    const currentUserId = getUserIdFromToken(token);
    const userId = route.params?.userId;

    const [isFollowing, setIsFollowing] = useState(false);

    const {
        data: userData,
        loading: userLoading,
        error: userError,
        refetch: refetchUser,
    } = useQuery(GET_USER_BY_ID, {
        variables: { id: userId },
        skip: !userId,
        fetchPolicy: "network-only",
    });

    const {
        data: postsData,
        loading: postsLoading,
    } = useQuery(GET_POSTS, {
        fetchPolicy: "network-only",
    });

    const [followUser, { loading: followLoading }] = useMutation(
        FOLLOW_USER,
        {
            onError: (error) => {
                console.log("Follow error:", error.message);
                Alert.alert("Failed", error.message || "Unable to follow user.");
            },
        }
    );

    const user = userData?.getUserById;
    const allPosts = postsData?.getPosts || [];

    const posts = allPosts.filter(
        (post) => String(post.authorId) === String(userId)
    );

    useEffect(() => {
        if (user && currentUserId) {
            const followingStatus = (user.followers || []).some(
                (follower) =>
                    String(follower._id) === String(currentUserId)
            );

            setIsFollowing(followingStatus);
        }
    }, [user, currentUserId]);

    useEffect(() => {
        if (userError) {
            Alert.alert("Failed to Load Profile", userError.message);
        }
    }, [userError]);

    async function handleFollow() {
        if (!userId || followLoading) return;

        if (String(userId) === String(currentUserId)) {
            Alert.alert("Notice", "You cannot follow yourself.");
            return;
        }

        try {
            const result = await followUser({
                variables: { userId },
            });

            const response = result.data?.followUser;

            if (response) {
                setIsFollowing(response.isFollowing);
                await refetchUser();
            }
        } catch (error) {
            console.log("Follow error:", error.message);
        }
    }

    function openPost(item) {
        navigation.navigate("PostDetail", {
            id: item._id,
            post: item,
        });
    }

    function renderPost({ item }) {
        return (
            <TouchableOpacity
                style={styles.gridItem}
                onPress={() => openPost(item)}
                activeOpacity={0.8}
            >
                {item.imgUrl ? (
                    <Image
                        source={{ uri: item.imgUrl }}
                        style={styles.gridImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.postPlaceholder}>
                        <Ionicons
                            name="image-outline"
                            size={30}
                            color="#888"
                        />
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    if (userLoading || postsLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3797EF" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.emptyTitle}>Profile not found</Text>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#262626" />
                </TouchableOpacity>

                <Text style={styles.headerUsername}>{user.username}</Text>

                <View style={styles.headerSpace} />
            </View>

            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => String(item._id)}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View>
                        <View style={styles.profileInfo}>
                            <Image
                                source={{
                                    uri: `https://i.pravatar.cc/150?u=${user._id}`,
                                }}
                                style={styles.avatar}
                            />

                            <View style={styles.statistics}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>
                                        {posts.length}
                                    </Text>
                                    <Text style={styles.statLabel}>Posts</Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>
                                        {user.followers?.length || 0}
                                    </Text>
                                    <Text style={styles.statLabel}>Followers</Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>
                                        {user.following?.length || 0}
                                    </Text>
                                    <Text style={styles.statLabel}>Following</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.bioContainer}>
                            <Text style={styles.fullName}>
                                {user.name || user.username}
                            </Text>
                            <Text style={styles.username}>@{user.username}</Text>
                        </View>

                        {String(user._id) !== String(currentUserId) && (
                            <TouchableOpacity
                                style={[
                                    styles.followButton,
                                    isFollowing && styles.followingButton,
                                ]}
                                onPress={handleFollow}
                                disabled={followLoading}
                            >
                                {followLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={isFollowing ? "#262626" : "#FFFFFF"}
                                    />
                                ) : (
                                    <Text
                                        style={[
                                            styles.followButtonText,
                                            isFollowing && styles.followingButtonText,
                                        ]}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        )}

                        <View style={styles.postsHeader}>
                            <Ionicons
                                name="grid-outline"
                                size={22}
                                color="#262626"
                            />
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyPosts}>
                        <Ionicons
                            name="images-outline"
                            size={40}
                            color="#AAAAAA"
                        />
                        <Text style={styles.emptyTitle}>No posts yet</Text>
                    </View>
                }
            />
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",
    },
    headerUsername: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#262626",
    },
    headerSpace: {
        width: 26,
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 20,
    },
    avatar: {
        width: 85,
        height: 85,
        borderRadius: 43,
        backgroundColor: "#EEEEEE",
    },
    statistics: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        marginLeft: 12,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#262626",
    },
    statLabel: {
        fontSize: 12,
        color: "#555555",
        marginTop: 4,
    },
    bioContainer: {
        paddingHorizontal: 18,
        marginBottom: 14,
    },
    fullName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#262626",
    },
    username: {
        fontSize: 13,
        color: "#777777",
        marginTop: 4,
    },
    followButton: {
        height: 38,
        backgroundColor: "#3797EF",
        borderRadius: 8,
        marginHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    followingButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDDDDD",
    },
    followButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
    },
    followingButtonText: {
        color: "#262626",
    },
    postsHeader: {
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#DDDDDD",
    },
    gridItem: {
        width: "33.3333%",
        aspectRatio: 1,
        padding: 1,
    },
    gridImage: {
        width: "100%",
        height: "100%",
        backgroundColor: "#EEEEEE",
    },
    postPlaceholder: {
        flex: 1,
        backgroundColor: "#EEEEEE",
        alignItems: "center",
        justifyContent: "center",
    },
    listContent: {
        paddingBottom: 30,
    },
    emptyPosts: {
        alignItems: "center",
        padding: 30,
    },
    emptyTitle: {
        fontSize: 16,
        color: "#555555",
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    loadingText: {
        marginTop: 10,
        color: "#777777",
    },
    backText: {
        color: "#3797EF",
        marginTop: 12,
    },
});