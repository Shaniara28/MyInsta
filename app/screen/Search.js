
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import BottomNav from "../navigations/BottomNav";

const SEARCH_USER = gql`
    query SearchUser($input: String!) {
        searchUser(input: $input) {
            _id
            name
            username
        }
    }
`;

export default function Search({ navigation }) {
    const [searchText, setSearchText] = useState("");

    const [searchUsers, { data, loading, error }] = useLazyQuery(
        SEARCH_USER,
        {
            fetchPolicy: "network-only",
        }
    );

    useEffect(() => {
        const keyword = searchText.trim();

        if (!keyword) return;

        const timer = setTimeout(() => {
            searchUsers({
                variables: {
                    input: keyword,
                },
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText, searchUsers]);

    useEffect(() => {
        if (error) {
            console.log("Search user error:", error);
            Alert.alert("Search Failed", error.message);
        }
    }, [error]);

    const users = data?.searchUser || [];

    function renderUser({ item }) {
        return (
            <TouchableOpacity
                style={styles.userItem}
                activeOpacity={0.7}
                onPress={() => {
                    Alert.alert(
                        item.name || item.username,
                        `Username: @${item.username}`
                    );
                }}
            >
                <Image
                    source={{
                        uri: `https://i.pravatar.cc/150?u=${item._id}`,
                    }}
                    style={styles.profileImage}
                />

                <View style={styles.userInfo}>
                    <Text style={styles.username}>
                        {item.username}
                    </Text>

                    <Text style={styles.fullName}>
                        {item.name || item.username}
                    </Text>
                </View>

                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#888888"
                />
            </TouchableOpacity>
        );
    }

    function renderContent() {
        if (!searchText.trim()) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="people-outline"
                        size={48}
                        color="#AAAAAA"
                    />

                    <Text style={styles.emptyTitle}>
                        Find People
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        Search for users by name or username.
                    </Text>
                </View>
            );
        }

        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#262626"
                    />
                    <Text style={styles.emptySubtitle}>
                        Searching users...
                    </Text>
                </View>
            );
        }

        if (users.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="person-outline"
                        size={48}
                        color="#AAAAAA"
                    />

                    <Text style={styles.emptyTitle}>
                        No users found
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        Try another name or username.
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.resultsContainer}
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Explore
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons
                    name="search-outline"
                    size={22}
                    color="#888888"
                />

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    placeholderTextColor="#888888"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                />

                {searchText.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setSearchText("")}
                    >
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color="#888888"
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.results}>
                {renderContent()}
            </View>

            <BottomNav />
        </View>
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
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#262626",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
        borderRadius: 10,
        margin: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: "#262626",
    },
    results: {
        flex: 1,
    },
    resultsContainer: {
        paddingBottom: 10,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "#EEEEEE",
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#EEEEEE",
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    username: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#262626",
    },
    fullName: {
        fontSize: 13,
        color: "#777777",
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#262626",
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#888888",
        textAlign: "center",
        marginTop: 6,
    },
});
