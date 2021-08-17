import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Helper from '../../lib/helper';
import { RootState } from '../store/store';

export interface IUIState {
  showCamera: boolean;
  lang: string;
  profilePhoto: any;
}

const initialState: IUIState = {
  showCamera: false,
  lang: 'en',
  profilePhoto: require('../../../assets/icon.png'),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showCamera: (state, action: PayloadAction<boolean>) => {
      state.showCamera = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      const lang = action.payload;
      Helper.updateDeviceLanguageToStorage(lang);
      state.lang = lang;
    },
    setProfilePhoto: (state, action: PayloadAction<any>) => {
      state.profilePhoto = action.payload;
    },
  },
});

// Actions generated from the slice
export const { showCamera, setLanguage, setProfilePhoto } = uiSlice.actions;

// export user selector to get the slice in any component
export const uiSelector = (state: RootState) => state.ui;

// export The reducer
const uiReducer = uiSlice.reducer;
export default uiReducer;
