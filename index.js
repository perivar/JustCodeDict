/**
 * @format
 */

import { AppRegistry, Text } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 20210817 JustCode: Redux Toolkit implementation
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store/store';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// 20210817 JustCode: Redux Toolkit implementation
const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// 20210817 JustCode: Redux Toolkit implementation. Change App to ReduxApp
AppRegistry.registerComponent(appName, () => ReduxApp);
