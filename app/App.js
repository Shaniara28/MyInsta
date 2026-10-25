import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigations/Root';
import { ApolloProvider } from "@apollo/client/react";
import client from './config/apollo';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}