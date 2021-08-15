import { ActionType } from 'redux-promise-middleware';

export interface IActionTypeUI {
  setLanguage: string;
  showCamera: string;
  setProfilePhoto: string;
}

export interface IActionTypePage {
  pageSearchSetUserWord: string;
  pageSearchSetError: string;
  pageSearchSetLoading: string;
  pageSearchShowCamera: string;
  pageSearchSetState: string;

  pageFavLoadListPending: string;
  pageFavLoadListFulfilled: string;
  pageFavLoadListRejected: string;

  pageFavDetailSetError: string;
  pageFavDetailSetLoading: string;
  pageFavDetailSetState: string;
}

export interface IActionType {
  ui: IActionTypeUI;
  page: IActionTypePage;
}

export const actionType: IActionType = {
  ui: {
    setLanguage: 'UI_SETLANGUAGE',
    showCamera: 'UI_SHOWCAMERA',
    setProfilePhoto: 'UI_SETPROFILEPHOTO',
  },
  page: {
    pageSearchSetUserWord: 'PAGESEARCH_SETUSERWORD',
    pageSearchSetError: 'PAGESEARCH_SETERROR',
    pageSearchSetLoading: 'PAGESEARCH_SETLOADING',
    pageSearchShowCamera: 'PAGESEARCH_SHOWCAMERA',
    pageSearchSetState: 'PAGESEARCH_SETSTATE',

    pageFavLoadListPending: `PAGEFAV_LOADLIST${ActionType.Pending}`,
    pageFavLoadListFulfilled: `PAGEFAV_LOADLIST${ActionType.Fulfilled}`,
    pageFavLoadListRejected: `PAGEFAV_LOADLIST${ActionType.Rejected}`,

    pageFavDetailSetError: 'PAGEFAVDETAIL_SETERROR',
    pageFavDetailSetLoading: 'PAGEFAVDETAIL_SETLOADING',
    pageFavDetailSetState: 'PAGEFAVDETAIL_SETSTATE',
  },
};
