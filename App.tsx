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

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import Setting from './src/screens/setting';
import Helper from './src/lib/helper';
import LocalizedStrings from 'react-native-localization';
import localeFile from './locale.json';
let localizedStrings = new LocalizedStrings(localeFile);

// 20200613 JustCode: Redux implementation
import { connect } from 'react-redux';
import * as uiActions from './src/redux/actions/uiActions';

const Drawer = createDrawerNavigator();
// 20200613 JustCode: Redux implementation, connect TabNav to Redux
const DrawerNav = connect<any, any, any>((state: any) => {
  return {
    ui: state.ui,
  };
})(props => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNav"
      drawerContent={drawerProps => (
        <DrawerContent {...drawerProps} {...props} />
      )}>
      {/* 20200529 JustCode: Change the hardcoded string to the localized string */}
      <Drawer.Screen
        name="TabNav"
        component={TabNav}
        options={{
          title: localizedStrings.DrawerNav.Screens.Home,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          title: localizedStrings.DrawerNav.Screens.MyProfile,
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
});

const DrawerContent = (props: any) => {
  return (
    <>
      <View style={commonStyles.drawerHeader}>
        <View style={{ width: 100, alignSelf: 'center' }}>
          <Image
            source={props.ui.get('profilePhoto')}
            style={commonStyles.drawerProfilePhoto}
          />
          <TouchableOpacity
            style={commonStyles.profileCamera}
            onPress={() => {
              props.dispatch(uiActions.showCamera(!props.ui.get('showCamera')));
            }}>
            <Icon name="ios-camera" size={50} color="#22222288" />
          </TouchableOpacity>
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList activeBackgroundColor={'transparent'} {...props} />
        <DrawerItem
          label={localizedStrings.DrawerNav.Screens.About}
          onPress={() => Linking.openURL('https://www.justnice.net')}
        />
      </DrawerContentScrollView>
    </>
  );
};

const Tab = createBottomTabNavigator();
// 20200613 JustCode: Redux implementation, connect TabNav to Redux
const TabNav = connect((state: any) => {
  return {
    ui: state.ui,
  };
})((props: any) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'logo-react';

          if (route.name === 'Search') {
            iconName = 'ios-search';
          } else if (route.name === 'Fav') {
            iconName = focused ? 'ios-heart' : 'ios-heart-outline';
          } else if (route.name === 'Setting') {
            iconName = 'md-settings';
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
      <Tab.Screen
        name="Search"
        component={Search}
        options={{ title: localizedStrings.TabNav.Tabs.Search }}
      />
      <Tab.Screen
        name="Fav"
        component={Fav}
        options={{ title: localizedStrings.TabNav.Tabs.Fav }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{ title: localizedStrings.TabNav.Tabs.Setting }}
      />
    </Tab.Navigator>
  );
});

interface IAppProps {
  dispatch: any;
  ui: any;
}

class App extends React.Component<IAppProps> {
  // 20200502 JustCode
  // Create a new constructor to check if there is any profile photo or not.
  componentDidMount() {
    // 20200529 JustCode - Get the user language setting from storage
    Helper.getDeviceLanguageFromStorage()
      .then(lang => {
        this.props.dispatch(uiActions.setLanguage(lang));
      })
      .catch(_ => {
        this.props.dispatch(uiActions.setLanguage('en'));
      });

    // Check if there is any profile photo or not.
    let path = RNFS.DocumentDirectoryPath + '/profilePic.png';
    RNFS.exists(path)
      .then(exist => {
        console.log('File exist: ', exist);
        if (exist) {
          RNFS.readFile(path, 'base64')
            .then(buffer => {
              console.log('File read.');
              this.props.dispatch(
                uiActions.setProfilePhoto({
                  uri: 'data:image/png;base64,' + buffer,
                })
              );
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
    this.props.dispatch(uiActions.showCamera(false));

    let path = RNFS.DocumentDirectoryPath + '/profilePic.png';

    // strip off the data: url prefix to get just the base64-encoded bytes
    var imgData = data.replace(/^data:image\/\w+;base64,/, '');

    // write the file
    RNFS.writeFile(path, imgData, 'base64')
      .then(() => {
        // Update the profilePhoto state so that the profile photo will update
        // to the latest photo
        this.props.dispatch(
          uiActions.setProfilePhoto({
            uri: 'data:image/png;base64,' + imgData,
          })
        );
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  render() {
    localizedStrings.setLanguage(this.props.ui.get('lang'));

    return (
      <NavigationContainer>
        <StatusBar barStyle="default" backgroundColor="#219bd9" />
        <DrawerNav {...this.props} />
        {this.props.ui.get('showCamera') && (
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
              this.props.dispatch(
                uiActions.showCamera(!this.props.ui.get('showCamera'))
              );
            }}
          />
        )}
      </NavigationContainer>
    );
  }
}

// Connect App to Redux state
export default connect((state: any) => {
  return {
    ui: state.ui,
  };
})(App);
