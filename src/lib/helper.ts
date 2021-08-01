export default class Helper {
  static isNotNullAndUndefined(obj: any, props?: string[]) {
    let bIsNullorUndefined = obj === null || obj === undefined;
    let curObj = null;

    if (!bIsNullorUndefined) {
      curObj = obj;
      if (props) {
        for (let idx = 0; idx < props.length; idx++) {
          bIsNullorUndefined =
            curObj[props[idx]] === null || curObj[props[idx]] === undefined;
          curObj = curObj[props[idx]]; // Set the curObj[props[idx]] to curObj so that it will recursive down the depth of the object

          if (bIsNullorUndefined) break;
        }
      }
    }

    return !bIsNullorUndefined;
  }

  static carefullyGetValue(obj: any, props: string[], defaultValue = '') {
    let bIsNullorUndefined = obj === null || obj === undefined;
    let curObj = null;

    if (!bIsNullorUndefined) {
      curObj = obj;
      if (props !== null) {
        for (let idx = 0; idx < props.length; idx++) {
          bIsNullorUndefined =
            curObj[props[idx]] === null || curObj[props[idx]] === undefined;
          curObj = curObj[props[idx]]; // Set the curObj[props[idx]] to curObj so that it will recursive down the depth of the object

          if (bIsNullorUndefined) break;
        }
      }
    }

    if (bIsNullorUndefined) return defaultValue;
    else return curObj;
  }

  static capitalize(str: string) {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
