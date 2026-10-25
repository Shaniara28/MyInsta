import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { SafeAreaView } from 'react-native-safe-area-context';

const ADD_POST = gql`
  mutation AddPost(
    $content: String!
    $tags: [String]
    $imgUrl: String
  ) {
    addPost(
      content: $content
      tags: $tags
      imgUrl: $imgUrl
    ) {
      _id
      content
      imgUrl
      tags
      authorId
      createdAt
    }
  }
`;

export default function CreatePost({ navigation }) {
    const [caption, setCaption] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [tags, setTags] = useState("");

    const [addPost, { loading }] = useMutation(ADD_POST, {
        refetchQueries: ["GetPosts"],
        awaitRefetchQueries: true,

        onError: (error) => {
            console.log("Add post error:", error.message);

            Alert.alert(
                "Failed",
                error.message || "Failed to create post."
            );
        },

        onCompleted: () => {
            Alert.alert("Success", "Your post has been shared!", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        },
    });

    const handleSharePost = async () => {
        Keyboard.dismiss();

        const trimmedCaption = caption.trim();
        const trimmedUrl = imageUrl.trim();

        if (!trimmedCaption) {
            Alert.alert("Warning", "Please enter a caption.");
            return;
        }

        if (
            trimmedUrl &&
            !/^https?:\/\/\S+$/i.test(trimmedUrl)
        ) {
            Alert.alert(
                "Invalid URL",
                "Please enter a valid image URL starting with http:// or https://."
            );
            return;
        }

        const formattedTags = [
            ...new Set(
                tags
                    .split(",")
                    .map((tag) => tag.trim().replace(/^#/, ""))
                    .filter((tag) => tag !== "")
            ),
        ];

        try {
            await addPost({
                variables: {
                    content: trimmedCaption,
                    imgUrl: trimmedUrl || null,
                    tags: formattedTags,
                },
            });
        } catch (error) {
            console.log("Share post error:", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#262626" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Create Post</Text>

                <TouchableOpacity
                    style={[
                        styles.shareButton,
                        loading && styles.disabledButton,
                    ]}
                    onPress={handleSharePost}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.shareButtonText}>Share</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.captionContainer}>
                    <Text style={styles.label}>Caption</Text>

                    <TextInput
                        style={styles.captionInput}
                        placeholder="What's on your mind?"
                        placeholderTextColor="#999"
                        value={caption}
                        onChangeText={setCaption}
                        multiline
                        textAlignVertical="top"
                        maxLength={2200}
                    />

                    <Text style={styles.characterCount}>
                        {caption.length}/2200
                    </Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Image URL</Text>

                    <TextInput
                        style={styles.textInput}
                        placeholder="https://example.com/image.jpg"
                        placeholderTextColor="#999"
                        value={imageUrl}
                        onChangeText={setImageUrl}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                    />

                    <Text style={styles.helperText}>
                        Paste an image URL to add a photo to your post.
                    </Text>
                </View>

                {imageUrl.trim() &&
                    /^https?:\/\/\S+$/i.test(imageUrl.trim()) && (
                        <View style={styles.previewContainer}>
                            <Text style={styles.label}>Image Preview</Text>

                            <Image
                                source={{ uri: imageUrl.trim() }}
                                style={styles.imagePreview}
                                resizeMode="cover"
                                onError={() => {
                                    console.log("Failed to load image URL");
                                }}
                            />
                        </View>
                    )}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Tags</Text>

                    <View style={styles.tagInputContainer}>
                        <Ionicons
                            name="pricetag-outline"
                            size={20}
                            color="#888"
                            style={styles.tagIcon}
                        />

                        <TextInput
                            style={styles.tagInput}
                            placeholder="travel, bali, holiday"
                            placeholderTextColor="#999"
                            value={tags}
                            onChangeText={setTags}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <Text style={styles.helperText}>
                        Separate multiple tags with commas.
                    </Text>

                    {tags.trim() !== "" && (
                        <View style={styles.tagPreviewContainer}>
                            {tags
                                .split(",")
                                .map((tag) =>
                                    tag.trim().replace(/^#/, "")
                                )
                                .filter((tag) => tag !== "")
                                .map((tag, index) => (
                                    <View
                                        key={`${tag}-${index}`}
                                        style={styles.tagChip}
                                    >
                                        <Text style={styles.tagChipText}>
                                            #{tag}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 55,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#262626",
    },
    shareButton: {
        backgroundColor: "#3797EF",
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 8,
        minWidth: 65,
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.6,
    },
    shareButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    captionContainer: {
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#262626",
        marginBottom: 10,
    },
    captionInput: {
        minHeight: 120,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        color: "#262626",
    },
    characterCount: {
        textAlign: "right",
        color: "#999",
        fontSize: 12,
        marginTop: 6,
    },
    textInput: {
        height: 48,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 14,
        color: "#262626",
    },
    helperText: {
        fontSize: 12,
        color: "#888",
        marginTop: 8,
    },
    previewContainer: {
        marginBottom: 24,
    },
    imagePreview: {
        width: "100%",
        height: 240,
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
    },
    tagInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 12,
        minHeight: 48,
    },
    tagIcon: {
        marginRight: 8,
    },
    tagInput: {
        flex: 1,
        fontSize: 14,
        color: "#262626",
        paddingVertical: 12,
    },
    tagPreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 12,
        gap: 8,
    },
    tagChip: {
        backgroundColor: "#EAF4FF",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
    },
    tagChipText: {
        color: "#3797EF",
        fontSize: 13,
        fontWeight: "500",
    },
});
