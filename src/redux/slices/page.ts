import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk, RootState } from '../store/store';
import Helper from '../../lib/helper';

interface ISearchState {
  userWord?: string;
  errorMsg?: string;
  loading?: boolean;
  definition?: any;
  showCamera?: boolean;
  showWordList?: boolean;
  recognizedText?: any;
}

interface IFavWord {
  addedOn: string;
  word: string;
  sense: string;
}

interface IFavState {
  favList: IFavWord[];
  errorMsg: string;
  loading: boolean;
  loaded: boolean;
}

interface IFavDetailState {
  errorMsg: string;
  loading: boolean;
  definition: any;
}

export interface IPageState {
  search: ISearchState;
  fav: IFavState;
  favDetail: IFavDetailState;
}

const initialState: IPageState = {
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
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    pageSearchSetUserWord: (state, action: PayloadAction<string>) => {
      state.search.userWord = action.payload;
    },
    pageSearchSetError: (state, action: PayloadAction<string>) => {
      state.search.errorMsg = action.payload;
    },
    pageSearchSetLoading: (state, action: PayloadAction<boolean>) => {
      state.search.loading = action.payload;
    },
    pageSearchShowCamera: (state, action: PayloadAction<boolean>) => {
      state.search.showCamera = action.payload;
    },
    pageSearchSetState: (state, action: PayloadAction<ISearchState>) => {
      state.search = { ...state.search, ...action.payload };
    },
    pageFavLoadListPending: state => {
      state.fav = { loading: true, loaded: false, favList: [], errorMsg: '' };
    },
    pageFavLoadListRejected: (state, action: PayloadAction<string>) => {
      state.fav = {
        loading: false,
        loaded: false,
        favList: [],
        errorMsg: action.payload,
      };
    },
    pageFavLoadListFulfilled: (state, action: PayloadAction<IFavWord[]>) => {
      state.fav = {
        loading: false,
        loaded: true,
        favList: action.payload,
        errorMsg: '',
      };
    },
    pageFavDetailSetError: (state, action: PayloadAction<string>) => {
      state.favDetail.errorMsg = action.payload;
    },
    pageFavDetailSetLoading: (state, action: PayloadAction<boolean>) => {
      state.favDetail.loading = action.payload;
    },
    pageFavDetailSetState: (state, action: PayloadAction<IFavDetailState>) => {
      state.favDetail = { ...state.favDetail, ...action.payload };
    },
  },
});

// Actions generated from the slice
export const {
  pageSearchSetUserWord,
  pageSearchSetError,
  pageSearchSetLoading,
  pageSearchShowCamera,
  pageSearchSetState,
  pageFavLoadListPending,
  pageFavLoadListRejected,
  pageFavLoadListFulfilled,
  pageFavDetailSetError,
  pageFavDetailSetLoading,
  pageFavDetailSetState,
} = pageSlice.actions;

// export user selector to get the slice in any component
export const pageSelector = (state: RootState) => state.page;

// export The reducer
const pageReducer = pageSlice.reducer;
export default pageReducer;

// Actions
export const pageFavLoadList =
  (): AppThunk => async (dispatch: AppDispatch) => {
    dispatch(pageFavLoadListPending());

    Helper.getFavList('')
      .then(result => {
        dispatch(pageFavLoadListFulfilled(result));
      })
      .catch(err => {
        dispatch(pageFavLoadListRejected(err));
      });
  };
