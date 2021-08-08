/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, StatusBar, Image, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Search from './src/screens/search';
import Fav from './src/screens/fav';
import Profile from './src/screens/profile';
import commonStyles from './commonStyles';

const Drawer = createDrawerNavigator();

const DrawerNav = (props: any) => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNav"
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="TabNav"
        component={TabNav}
        options={{ title: 'Home', headerShown: false }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'My Profile', headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

const DrawerContent = (props: any) => {
  return (
    <>
      <View style={commonStyles.drawerHeader}>
        <Image
          source={require('./assets/icon.png')}
          style={commonStyles.drawerProfilePhoto}
        />
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList activeBackgroundColor={'transparent'} {...props} />
        <DrawerItem
          label="About"
          onPress={() => Linking.openURL('https://www.justnice.net')}
        />
      </DrawerContentScrollView>
    </>
  );
};

const Tab = createBottomTabNavigator();
const TabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'logo-react';

          if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Fav') {
            iconName = focused ? 'ios-heart' : 'ios-heart-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: '#219bd9',
        tabBarInactiveBackgroundColor: '#d6f9ff',
        tabBarItemStyle: { height: 60, bottom: 0, paddingBottom: 15 },
        headerShown: false,
      })}>
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Fav" component={Fav} />
    </Tab.Navigator>
  );
};

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar barStyle="default" backgroundColor="#219bd9" />
        <DrawerNav />
      </NavigationContainer>
    );
  }
}

export default App;
