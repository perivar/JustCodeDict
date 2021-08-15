import { actionType } from './actionType';
import Helper from '../../lib/helper';

export function pageSearchSetUserWord(userWord: string) {
  return {
    type: actionType.page.pageSearchSetUserWord,
    payload: userWord,
  };
}

export function pageSearchSetError(error: any) {
  return {
    type: actionType.page.pageSearchSetError,
    payload: error,
  };
}

export function pageSearchSetLoading(loading: boolean) {
  return {
    type: actionType.page.pageSearchSetLoading,
    payload: loading,
  };
}

export function pageSearchShowCamera(show: boolean) {
  return {
    type: actionType.page.pageSearchShowCamera,
    payload: show,
  };
}

export function pageSearchSetState(state: any) {
  return {
    type: actionType.page.pageSearchSetState,
    payload: state,
  };
}

export function pageFavLoadList() {
  return function (dispatch: any) {
    dispatch({ type: actionType.page.pageFavLoadListPending, payload: null });

    Helper.getFavList('')
      .then(result => {
        dispatch({
          type: actionType.page.pageFavLoadListFulfilled,
          payload: result,
        });
      })
      .catch(err => {
        dispatch({
          type: actionType.page.pageFavLoadListRejected,
          payload: err,
        });
      });
  };
}

export function pageFavDetailSetError(error: any) {
  return {
    type: actionType.page.pageFavDetailSetError,
    payload: error,
  };
}

export function pageFavDetailSetLoading(loading: boolean) {
  return {
    type: actionType.page.pageFavDetailSetLoading,
    payload: loading,
  };
}

export function pageFavDetailSetState(state: any) {
  return {
    type: actionType.page.pageFavDetailSetState,
    payload: state,
  };
}
