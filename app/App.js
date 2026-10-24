import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigations/Root';


export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}