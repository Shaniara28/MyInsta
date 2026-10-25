
import { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from "../navigations/BottomNav";
import { useAuth } from "../context/AuthContext";

// Mengambil profil pengguna beserta followers dan following
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

// Mengambil postingan
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
        console.log("Failed to read user ID from token:", error);
        return null;
    }
}

export default function Profile({ navigation }) {
    const { token, signOut } = useAuth();

    const [listVisible, setListVisible] = useState(false);
    const [listType, setListType] = useState("followers");

    const userId = getUserIdFromToken(token);

    const {
        data: userData,
        loading: userLoading,
        error: userError,
    } = useQuery(GET_USER_BY_ID, {
        variables: { id: userId },
        skip: !userId,
        fetchPolicy: "network-only",
    });

    const {
        data: postsData,
        loading: postsLoading,
        error: postsError,
    } = useQuery(GET_POSTS, {
        skip: !userId,
        fetchPolicy: "network-only",
    });

    const user = userData?.getUserById;
    const allPosts = postsData?.getPosts || [];

    const posts = allPosts.filter(
        (post) => String(post.authorId) === String(user?._id)
    );

    const followers = user?.followers || [];
    const following = user?.following || [];

    useEffect(() => {
        if (userError) {
            Alert.alert("Failed to Load Profile", userError.message);
        }
    }, [userError]);

    useEffect(() => {
        if (postsError) {
            Alert.alert("Failed to Load Posts", postsError.message);
        }
    }, [postsError]);

    async function handleLogout() {
        try {
            await signOut();
        } catch (error) {
            Alert.alert("Logout Failed", error.message);
        }
    }

    function handleSettings() {
        Alert.alert("Settings", "Choose an option", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: handleLogout,
            },
        ]);
    }

    function handleEditProfile() {
        Alert.alert(
            "Edit Profile",
            "The edit profile feature is coming soon."
        );
    }

    function openUserList(type) {
        setListType(type);
        setListVisible(true);
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
                            color="#888888"
                        />
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    function renderUser({ item }) {
        return (
            <TouchableOpacity
                style={styles.userItem}
                activeOpacity={0.7}
                onPress={() => {
                    setListVisible(false);
                }}
            >
                <Image
                    source={{
                        uri: `https://i.pravatar.cc/150?u=${item._id}`,
                    }}
                    style={styles.userAvatar}
                />

                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {item.username || "Unknown User"}
                    </Text>
                    <Text style={styles.userFullName}>
                        {item.name || item.username || ""}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    if (userLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#262626" />
                <Text style={styles.loadingText}>
                    Loading profile...
                </Text>
            </View>
        );
    }

    if (!userId) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.emptyTitle}>
                    User ID not found
                </Text>
                <Text style={styles.loadingText}>
                    Please log in again.
                </Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.emptyTitle}>
                    Profile not found
                </Text>
            </View>
        );
    }

    const selectedUsers =
        listType === "followers" ? followers : following;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.headerUsername}>
                    {user.username}
                </Text>

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
                keyExtractor={(item) => item._id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View>
                        <View style={styles.profileInfo}>
                            <Image
                                source={{
                                    uri: `https://pub-dc9a9c6ac2a64ba48bce426ced0ac56a.r2.dev/idols/Yoona/_live/profile_1791804111876_ae796670-e03d-45b9-ad7f-7cbea5a522b5.jpg`,
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

                                <TouchableOpacity
                                    style={styles.statItem}
                                    onPress={() =>
                                        openUserList("followers")
                                    }
                                >
                                    <Text style={styles.statNumber}>
                                        {followers.length}
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Followers
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.statItem}
                                    onPress={() =>
                                        openUserList("following")
                                    }
                                >
                                    <Text style={styles.statNumber}>
                                        {following.length}
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Following
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.bioContainer}>
                            <Text style={styles.fullName}>
                                {user.name}
                            </Text>
                            <Text style={styles.bio}>
                                Welcome to my profile!
                            </Text>
                        </View>

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
                                        "Share Profile",
                                        "Profile sharing is coming soon."
                                    )
                                }
                            >
                                <Text style={styles.editButtonText}>
                                    Share Profile
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tabs}>
                            <Ionicons
                                name="grid-outline"
                                size={25}
                                color="#262626"
                            />
                        </View>

                        {postsLoading && (
                            <ActivityIndicator
                                style={{ marginTop: 15 }}
                                color="#262626"
                            />
                        )}

                        {!postsLoading && posts.length === 0 && (
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

            <Modal
                visible={listVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setListVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {listType === "followers"
                                    ? "Followers"
                                    : "Following"}
                            </Text>

                            <TouchableOpacity
                                onPress={() => setListVisible(false)}
                            >
                                <Ionicons
                                    name="close"
                                    size={26}
                                    color="#262626"
                                />
                            </TouchableOpacity>
                        </View>

                        {selectedUsers.length === 0 ? (
                            <View style={styles.emptyList}>
                                <Text style={styles.emptyListText}>
                                    {listType === "followers"
                                        ? "No followers yet."
                                        : "You are not following anyone yet."}
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={selectedUsers}
                                renderItem={renderUser}
                                keyExtractor={(item) => item._id}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </View>
            </Modal>
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
    headerUsername: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#262626",
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingTop: 20,
    },
    avatar: {
        width: 82,
        height: 82,
        borderRadius: 41,
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
        minWidth: 55,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#262626",
    },
    statLabel: {
        fontSize: 13,
        color: "#333333",
        marginTop: 4,
    },
    bioContainer: {
        paddingHorizontal: 18,
        marginTop: 16,
    },
    fullName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#262626",
    },
    bio: {
        fontSize: 14,
        lineHeight: 20,
        color: "#262626",
        marginTop: 4,
    },
    profileButtons: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginTop: 16,
        gap: 8,
    },
    editButton: {
        flex: 1,
        backgroundColor: "#EFEFEF",
        borderRadius: 7,
        alignItems: "center",
        paddingVertical: 9,
    },
    shareButton: {
        flex: 1,
        backgroundColor: "#EFEFEF",
        borderRadius: 7,
        alignItems: "center",
        paddingVertical: 9,
    },
    editButtonText: {
        color: "#262626",
        fontSize: 13,
        fontWeight: "bold",
    },
    tabs: {
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",
        marginTop: 12,
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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEEEEE",
    },
    listContent: {
        paddingBottom: 15,
    },
    emptyContainer: {
        alignItems: "center",
        padding: 30,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        color: "#262626",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    loadingText: {
        marginTop: 10,
        color: "#666666",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
    modalContainer: {
        height: "65%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingBottom: 20,
    },
    modalHeader: {
        height: 58,
        paddingHorizontal: 18,
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#262626",
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    userAvatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#EEEEEE",
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#262626",
    },
    userFullName: {
        fontSize: 13,
        color: "#777777",
        marginTop: 3,
    },
    emptyList: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyListText: {
        fontSize: 14,
        color: "#777777",
    },
});
