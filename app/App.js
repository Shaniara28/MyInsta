import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigations/Root';
import { ApolloProvider } from "@apollo/client/react";
import client from './config/apollo';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </ApolloProvider>
  );
}