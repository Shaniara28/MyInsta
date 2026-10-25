import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    link: new HttpLink({ uri: "https://gsx10qtk-3000.asse.devtunnels.ms/" }),
    cache: new InMemoryCache(),
});

export default client;