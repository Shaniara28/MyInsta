
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = new HttpLink({
    uri: "https://gsx10qtk-3000.asse.devtunnels.ms/",
});

const authLink = setContext(async (_, { headers }) => {
    const token = await SecureStore.getItemAsync("token");

    return {
        headers: {
            ...headers,
            ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
