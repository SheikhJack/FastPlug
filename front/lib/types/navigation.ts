import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from './product';

export type RootDrawerParamList = {
  MainLanding: undefined;
  // Add other drawer screens here
  Profile: undefined;
  Settings: undefined;
  // ... etc
};

export type RootStackParamList = {
  MainLanding: undefined;
  SearchResult: undefined;
  ProfileDashboard: undefined;
  ShoppingCart: undefined;
  AddressList: undefined;
  Checkout: undefined;
  SignIn: { backScreen?: any };
  SignUp: undefined;
  login: undefined;
  register: undefined;
   Cart: undefined;
   ProductDescription: { product: Product };
  Categories: undefined;
  Orders: undefined;
  Wishlist: undefined;
};

export type BottomTabProps = {
  screen: 'HOME' | 'SEARCH' | 'PROFILE' | 'CART';
};

export type AuthStackParamList = {
  SignIn: { backScreen?: string };
  SignUp: undefined;
};

export type MainStackParamList = {
  MainLanding: undefined;
  Cart: undefined;
};

export type BottomTabNavigationProp = StackNavigationProp<RootStackParamList>;