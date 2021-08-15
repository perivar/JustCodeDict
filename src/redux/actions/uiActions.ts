import { actionType } from './actionType';
import Helper from '../../lib/helper';

export function setLanguage(lang: string) {
  Helper.updateDeviceLanguageToStorage(lang);
  return {
    type: actionType.ui.setLanguage,
    payload: lang,
  };
}

export function showCamera(show: boolean) {
  return {
    type: actionType.ui.showCamera,
    payload: show,
  };
}

export function setProfilePhoto(photo: any) {
  return {
    type: actionType.ui.setProfilePhoto,
    payload: photo,
  };
}
