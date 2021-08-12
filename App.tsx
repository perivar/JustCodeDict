/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  StatusBar,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
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

// 20200501 JustCode: Import the camera and file system module
import Camera, { Constants } from './src/components/camera';
import RNFS from 'react-native-fs';

const Drawer = createDrawerNavigator();

const DrawerNav = (props: any) => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNav"
      drawerContent={
        // 20200501 JustCode:
        // Pass in the toggleCamera from parent component (App) method to DrawerContent
        // Add profilePhoto props to hold the profile image
        drawerProps => (
          <DrawerContent
            {...drawerProps}
            toggleCamera={props.toggleCamera}
            profilePhoto={props.profilePhoto}
          />
        )
      }>
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
        {/*
          20200430 - JustCode:
            Add a new Camera icon on top of the profile photo.
        */}
        <View style={{ width: 100, alignSelf: 'center' }}>
          <Image
            source={props.profilePhoto}
            style={commonStyles.drawerProfilePhoto}
          />
          <TouchableOpacity
            style={commonStyles.profileCamera}
            onPress={() => {
              // Call the toggleCamera passed by DrawerNav
              props.toggleCamera && props.toggleCamera();
            }}>
            <Icon name="ios-camera" size={50} color="#22222288" />
          </TouchableOpacity>
        </View>
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

interface IAppState {
  showCamera: boolean;
  profilePhoto: any;
}

class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCamera: false, // Hide the camera by default
      profilePhoto: require('./assets/icon.png'), // Set the default profile photo to icon.png
    };
  }

  // 20200502 JustCode
  // Create a new constructor to check if there is any profile photo or not.
  componentDidMount() {
    // Check if there is any profile photo or not.
    let path = RNFS.DocumentDirectoryPath + '/profilePic.png';
    RNFS.exists(path)
      .then(exist => {
        console.log('File exist: ', exist);
        if (exist) {
          RNFS.readFile(path, 'base64')
            .then(buffer => {
              console.log('File read.');
              this.setState({
                profilePhoto: {
                  uri: 'data:image/png;base64,' + buffer,
                },
              });
            })
            .catch(err => {
              console.log('Unable to read profile photo. ', err);
            });
        }
      })
      .catch(err => {
        console.log('Unable to access file system. ', err);
      });
  }

  saveProfilePhoto(data: any) {
    this.setState({ showCamera: false });

    let path = RNFS.DocumentDirectoryPath + '/profilePic.png';

    // strip off the data: url prefix to get just the base64-encoded bytes
    var imgData = data.replace(/^data:image\/\w+;base64,/, '');

    // write the file
    RNFS.writeFile(path, imgData, 'base64')
      .then(_ => {
        // Update the profilePhoto state so that the profile photo will update
        // to the latest photo
        this.setState({
          profilePhoto: {
            uri: 'data:image/png;base64,' + imgData,
          },
        });
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  render() {
    return (
      <NavigationContainer>
        <StatusBar barStyle="default" backgroundColor="#219bd9" />
        {/*
          20200501 JustCode:
          Define a method called toggleCamera in the props of DrawerNav.
          Define a profilePhoto prop to hold the user profile photo.
        */}
        <DrawerNav
          {...this.props}
          toggleCamera={() => {
            this.setState({ showCamera: !this.state.showCamera });
          }}
          profilePhoto={this.state.profilePhoto}
        />
        {/*
          20200501 JustCode:
          Show the camera when user click on the camera button.
        */}
        {this.state.showCamera && (
          <Camera
            cameraType={Constants.Type.front}
            flashMode={Constants.FlashMode.off}
            autoFocus={Constants.AutoFocus.on}
            whiteBalance={Constants.WhiteBalance.auto}
            ratio={'1:1'}
            quality={0.5}
            imageWidth={800}
            onCapture={(data: any) => this.saveProfilePhoto(data)}
            onClose={() => {
              this.setState({ showCamera: false });
            }}
          />
        )}
      </NavigationContainer>
    );
  }
}

export default App;
