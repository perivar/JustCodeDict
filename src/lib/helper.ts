import AsyncStorage from '@react-native-community/async-storage';

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

  static async isFav(word: string) {
    let isFavourited = false;

    try {
      const result = (await AsyncStorage.getItem('myFav')) as string;

      if (Helper.isNotNullAndUndefined(result)) {
        let favList = JSON.parse(result);
        let isExist = favList.filter(
          (item: any) => item.word.toUpperCase() === word.toUpperCase()
        );
        if (Helper.isNotNullAndUndefined(isExist)) {
          isFavourited = isExist.length > 0;
        }
      }
    } catch (error) {
      isFavourited = false;
    }
    return isFavourited;
  }

  static async makeFav(word: string, sense: string) {
    // Always insert the new word to the first item in the array
    let favList = [{ word: word, sense: sense, addedOn: new Date() }];

    try {
      let existingFav = [];
      let existingFavStr = (await AsyncStorage.getItem('myFav')) as string;
      if (Helper.isNotNullAndUndefined(existingFavStr)) {
        existingFav = JSON.parse(existingFavStr);
      }

      if (existingFav.length > 0) {
        favList = favList.concat(existingFav);
      }

      const result = await AsyncStorage.setItem(
        'myFav',
        JSON.stringify(favList)
      );
    } catch (error) {
      // ignore catch
    }
  }

  static async deleteFav(word: string, callback: any | null = null) {
    let favList = [];

    try {
      let existingFavStr = (await AsyncStorage.getItem('myFav')) as string;
      if (Helper.isNotNullAndUndefined(existingFavStr)) {
        favList = JSON.parse(existingFavStr);
      }

      if (favList.length > 0) {
        let isExist = favList.filter(
          (item: any) => item.word.toUpperCase() === word.toUpperCase()
        );
        if (Helper.isNotNullAndUndefined(isExist) && isExist.length > 0) {
          const index = favList.indexOf(isExist[0]);
          if (index > -1) {
            favList.splice(index, 1);
            const result = await AsyncStorage.setItem(
              'myFav',
              JSON.stringify(favList)
            );
            if (callback) callback();
          }
        }
      }
    } catch (error) {
      // ignore catch
    }
  }

  static async getFavList(search: string) {
    let favList = [];

    try {
      let favListStr = (await AsyncStorage.getItem('myFav')) as string;
      if (Helper.isNotNullAndUndefined(favListStr)) {
        favList = JSON.parse(favListStr);
      }

      if (
        favList.length > 0 &&
        Helper.isNotNullAndUndefined(search) &&
        search.length > 0
      ) {
        let filteredList = favList.filter((item: any) =>
          item.word.toUpperCase().includes(search.toUpperCase())
        );
        return filteredList;
      } else {
        return favList;
      }
    } catch (error) {
      return favList;
    }
  }

  static getSense(def: any) {
    let defSense = '';
    if (Helper.isNotNullAndUndefined(def, ['results', '0', 'lexicalEntries'])) {
      let lexicalEntries = def.results[0].lexicalEntries;

      for (let lexicalIndex in lexicalEntries) {
        let lexicalItem = lexicalEntries[lexicalIndex];
        if (
          this.isNotNullAndUndefined(lexicalItem, ['entries', '0', 'senses'])
        ) {
          let senses = lexicalItem.entries[0].senses;
          if (senses && senses.length > 0) {
            for (let senseIndex in senses) {
              let sense = senses[senseIndex];
              if (sense.definitions) {
                // Only if sense have definition
                let definition = Helper.carefullyGetValue(
                  sense,
                  ['definitions', '0'],
                  ''
                );
                if (definition.length > 0) {
                  defSense = definition;
                  break;
                }
              }
            }
          }
        }

        if (defSense.length > 0) break;
      }
    }

    return defSense;
  }
}
