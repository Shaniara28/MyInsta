import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Link } from '@react-navigation/native';

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 10 }}>Hello world!</Text>
            <Button
                onPress={() => {
                    console.log("Button pressed");
                }}
                title="Learn More"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
            <Image
                style={styles.tinyLogo}
                source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}
            />
            <StatusBar style="auto" />
            <Link screen="Detail">Go to Details</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tinyLogo: {
        width: 50,
        height: 50,
        marginTop: 10
    },
});
