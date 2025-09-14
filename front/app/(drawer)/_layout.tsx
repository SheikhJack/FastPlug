import { Drawer } from 'expo-router/drawer';
import { MainMenu } from '@/components/MainMenu'; 
import { useAuth } from '@/context/authContext';
import { Redirect } from 'expo-router';




export default function DrawerLayout() {

   
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }


  
  return (
    <Drawer
      drawerContent={MainMenu}
      screenOptions={{
        headerShown: false, 
        swipeEdgeWidth: 200,
      }}>
      {/* This screen contains your main app stack */}
      <Drawer.Screen
        name="(stack)" 
        options={{
          title: 'Home', 
        }}
      />
      
      {/* You can add additional direct drawer screens here */}
      {/* <Drawer.Screen
        name="profile"
        options={{
          title: 'My Profile',
        }}
      /> */}
    </Drawer>
  );
}