
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePost({ navigation, route }) {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    function handleShare() {
        if (!image) {
            Alert.alert('Post Failed', 'Please select an image first.');
            return;
        }

        const newPost = {
            id: Date.now().toString(),
            username: 'you',
            profileImage: 'https://i.pravatar.cc/150?img=12',
            postImage: image,
            caption: caption,
            likes: 0,
            isLiked: false,
        };

        route.params?.onCreatePost?.(newPost);

        Alert.alert('Success', 'Your post has been shared!', [
            {
                text: 'OK',
                onPress: () => navigation.goBack(),
            },
        ]);
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#222" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Create Post</Text>
                <Text></Text>
            </View>

            <ScrollView>
                {/* Image Preview */}
                <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={pickImage}
                >
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={styles.previewImage}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons
                                name="image-outline"
                                size={60}
                                color="#888"
                            />
                            <Text style={styles.imageTitle}>
                                Select a photo
                            </Text>
                            <Text style={styles.imageSubtitle}>
                                Choose a photo from your gallery
                            </Text>

                            <View style={styles.selectButton}>
                                <Text style={styles.selectButtonText}>
                                    Choose Photo
                                </Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                {image && (
                    <TouchableOpacity
                        style={styles.changeImageButton}
                        onPress={pickImage}
                    >
                        <Ionicons
                            name="image-outline"
                            size={18}
                            color="#0095F6"
                        />
                        <Text style={styles.changeImageText}>
                            Change Photo
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Caption */}
                <View style={styles.captionContainer}>
                    <Text style={styles.label}>Write a caption</Text>

                    <TextInput
                        style={styles.captionInput}
                        placeholder="What's on your mind?"
                        placeholderTextColor="#999"
                        multiline
                        value={caption}
                        onChangeText={setCaption}
                        maxLength={500}
                    />

                    <Text style={styles.characterCount}>
                        {caption.length}/500
                    </Text>
                </View>

                {/* Share Button */}
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShare}
                >
                    <Text style={styles.shareButtonText}>Share Post</Text>
                </TouchableOpacity>
            </ScrollView>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#262626',
        marginStart: -25
    },
    imageContainer: {
        margin: 18,
        height: 300,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 12,
    },
    imageSubtitle: {
        fontSize: 13,
        color: '#888888',
        marginTop: 6,
    },
    selectButton: {
        backgroundColor: '#0095F6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 18,
    },
    selectButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    changeImageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -5,
        marginBottom: 20,
    },
    changeImageText: {
        color: '#0095F6',
        marginLeft: 6,
        fontWeight: '600',
    },
    captionContainer: {
        paddingHorizontal: 18,
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#262626',
        marginBottom: 10,
    },
    captionInput: {
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        color: '#262626',
        textAlignVertical: 'top',
    },
    characterCount: {
        textAlign: 'right',
        color: '#888888',
        fontSize: 12,
        marginTop: 5,
    },
    shareButton: {
        backgroundColor: '#0095F6',
        marginHorizontal: 18,
        marginTop: 25,
        marginBottom: 30,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
