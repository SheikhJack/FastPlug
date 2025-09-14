import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/lib/types/navigation';
import MainLanding from '.';


const Stack = createStackNavigator<RootStackParamList>();

export default function StackLayout() {
  return (
    <Stack.Navigator>
      {/* Each screen corresponds to a file in this folder */}
      <Stack.Screen name="MainLanding" component={MainLanding} /> 
      {/* <Stack.Screen name="address-list" options={{ title: 'My Addresses' }} />
      <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
      <Stack.Screen name="product-listing" options={{ title: 'Products' }} />
      <Stack.Screen name="order-detail" options={{ title: 'Order Details' }} />
      <Stack.Screen name="product-description" options={{ title: 'Product Details' }} />
      <Stack.Screen name="shopping-cart" options={{ title: 'Shopping Cart' }} /> */}
      
      {/* Add all other screens here... */}
    </Stack.Navigator>
  );
}