import { combineReducers } from '@reduxjs/toolkit';

import ui from './ui';
import page from './page';

const rootReducer = combineReducers({
  ui,
  page,
});

export default rootReducer;
