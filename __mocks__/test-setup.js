import React from 'react';
import * as ReactNative from 'react-native';

import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

jest.mock(
  'react-native-localization',
  () =>
    class RNLocalization {
      language = 'en';

      constructor(props) {
        this.props = props;
        this.setLanguage(this.language);
      }

      setLanguage(interfaceLanguage) {
        this.language = interfaceLanguage;
        if (this.props[interfaceLanguage]) {
          var localizedStrings = this.props[this.language];
          for (var key in localizedStrings) {
            if (localizedStrings.hasOwnProperty(key))
              this[key] = localizedStrings[key];
          }
        }
      }
    }
);

jest.mock('@react-navigation/drawer', () => {
  return {
    addEventListener: jest.fn(),
    createDrawerNavigator: jest.fn().mockReturnValue({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ children }) => <>{children}</>,
    }),
  };
});

jest.doMock('react-native', () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      // Mock out properties of an already mocked export
      BackHandler: {
        ...ReactNative.BackHandler,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      Linking: {
        ...ReactNative.Linking,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      // Mock a native module
      Platform: {
        OS: 'android',
        select: () => {},
      },
      NativeModules: {
        ...ReactNative.NativeModules,
        RNFBAdMobModule: {},
        RNFBAdMobInterstitialModule: {},
        RNFBAdMobRewardedModule: {},
        RNFBAdsConsentModule: {},
        RNFBAppModule: {
          NATIVE_FIREBASE_APPS: [
            {
              appConfig: {
                name: '[DEFAULT]',
              },
              options: {},
            },

            {
              appConfig: {
                name: 'secondaryFromNative',
              },
              options: {},
            },
          ],
          addListener: jest.fn(),
          eventsAddListener: jest.fn(),
          eventsNotifyReady: jest.fn(),
        },
        RNFBAuthModule: {
          APP_LANGUAGE: {
            '[DEFAULT]': 'en-US',
          },
          APP_USER: {
            '[DEFAULT]': 'jestUser',
          },
          addAuthStateListener: jest.fn(),
          addIdTokenListener: jest.fn(),
          useEmulator: jest.fn(),
        },
        RNFBCrashlyticsModule: {},
        RNFBPerfModule: {},
        RNVectorIconsManager: jest.mock(),
      },
      StyleSheet: {
        create: jest.fn(),
      },
    },
    ReactNative
  );
});
