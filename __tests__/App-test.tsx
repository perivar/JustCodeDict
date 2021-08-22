/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
const middlewares: any = [];
const mockStore = configureStore(middlewares);

// Initialize mockstore with empty state
const initialState = {
  ui: { lang: 'en' },
  page: { search: { userWord: '', errorMsg: '' } },
};
const store = mockStore(initialState);

it('renders correctly', async () => {
  renderer.create(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
