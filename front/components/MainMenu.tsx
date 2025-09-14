import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Button, View} from 'react-native';

export function MainMenu(props: DrawerContentComponentProps) {
  const router = useRouter();
  
  return (
    <View>
      {/* Use router.push to navigate to routes */}
      <Button 
        title="Home" 
        onPress={() => router.push('/(drawer)/(stack)')} 
      />
      <Button 
        title="Addresses" 
        onPress={() => router.push('/(drawer)/(stack)/address-list')} 
      />
      <Button
        title="Sign In" 
        onPress={() => router.push('/(drawer)/(stack)/sign-in')} 
      />
    </View>
  );
}