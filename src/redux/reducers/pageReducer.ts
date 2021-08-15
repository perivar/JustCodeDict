import { actionType } from '../actions/actionType';
import { fromJS } from 'immutable';

function initialState() {
  return fromJS({
    search: {
      userWord: '',
      errorMsg: '',
      loading: false,
      definition: null,
      showCamera: false,
      showWordList: false,
      recognizedText: null,
    },
    fav: {
      favList: [],
      errorMsg: '',
      loading: true,
      loaded: false,
    },
    favDetail: {
      errorMsg: '',
      loading: false,
      definition: null,
    },
  });
}

export default function reducer(state = initialState(), action: any) {
  if (typeof reducer.prototype[action.type] === 'function') {
    return reducer.prototype[action.type](state, action);
  } else {
    return state;
  }
}

reducer.prototype[actionType.page.pageSearchSetUserWord] = (
  state: any,
  action: any
) => {
  return state.setIn('search.userWord'.split('.'), action.payload);
};

reducer.prototype[actionType.page.pageSearchSetError] = (
  state: any,
  action: any
) => {
  return state.setIn('search.errorMsg'.split('.'), action.payload);
};

reducer.prototype[actionType.page.pageSearchSetLoading] = (
  state: any,
  action: any
) => {
  return state.setIn('search.loading'.split('.'), action.payload);
};

reducer.prototype[actionType.page.pageSearchShowCamera] = (
  state: any,
  action: any
) => {
  return state.setIn('search.showCamera'.split('.'), action.payload);
};

reducer.prototype[actionType.page.pageSearchSetState] = (
  state: any,
  action: any
) => {
  let keys = Object.keys(action.payload);

  if (keys.length <= 0) return state;

  let newState = state;

  for (let idx = 0; idx < keys.length; idx++) {
    newState = newState.setIn(['search', keys[idx]], action.payload[keys[idx]]);
  }

  return newState;
};

reducer.prototype[actionType.page.pageFavLoadListPending] = (
  state: any,
  action: any
) => {
  return state
    .setIn('fav.loading'.split('.'), true)
    .setIn('fav.loaded'.split('.'), false)
    .setIn('fav.favList'.split('.'), [])
    .setIn('fav.errorMsg'.split('.'), '');
};

reducer.prototype[actionType.page.pageFavLoadListRejected] = (
  state: any,
  action: any
) => {
  return state
    .setIn('fav.loading'.split('.'), false)
    .setIn('fav.loaded'.split('.'), false)
    .setIn('fav.favList'.split('.'), [])
    .setIn('fav.errorMsg'.split('.'), action.payload);
};

reducer.prototype[actionType.page.pageFavLoadListFulfilled] = (
  state: any,
  action: any
) => {
  return state
    .setIn('fav.loading'.split('.'), false)
    .setIn('fav.loaded'.split('.'), true)
    .setIn('fav.favList'.split('.'), action.payload)
    .setIn('fav.errorMsg'.split('.'), '');
};

reducer.prototype[actionType.page.pageFavDetailSetError] = (
  state: any,
  action: any
) => {
  return state.setIn('favDetail.errorMsg'.split('.'), action.payload);
};

reducer.prototype[actionType.page.pageFavDetailSetLoading] = (
  state: any,
  action: any
) => {
  return state.setIn('favDetail.loading'.split('.'), action.payload);
};

reducer.prototype[actionType.page.pageFavDetailSetState] = (
  state: any,
  action: any
) => {
  let keys = Object.keys(action.payload);

  if (keys.length <= 0) return state;

  let newState = state;

  for (let idx = 0; idx < keys.length; idx++) {
    newState = newState.setIn(
      ['favDetail', keys[idx]],
      action.payload[keys[idx]]
    );
  }

  return newState;
};
