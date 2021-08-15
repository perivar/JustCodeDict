import { actionType } from '../actions/actionType';
import { fromJS } from 'immutable';

function initialState() {
  return fromJS({
    showCamera: false,
    lang: 'en',
    profilePhoto: require('../../../assets/icon.png'),
  });
}

export default function reducer(state = initialState(), action: any) {
  if (typeof reducer.prototype[action.type] === 'function') {
    return reducer.prototype[action.type](state, action);
  } else {
    return state;
  }
}

reducer.prototype[actionType.ui.showCamera] = (state: any, action: any) => {
  return state.set('showCamera', action.payload);
};

reducer.prototype[actionType.ui.setLanguage] = (state: any, action: any) => {
  return state.set('lang', action.payload);
};

reducer.prototype[actionType.ui.setProfilePhoto] = (
  state: any,
  action: any
) => {
  return state.set('profilePhoto', action.payload);
};
