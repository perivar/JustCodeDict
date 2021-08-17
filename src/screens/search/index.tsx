/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Api from '../../lib/api';
import Helper from '../../lib/helper';
import WordDefinition from '../../components/wordDef';
import Header from '../../components/header';
import commonStyles from '../../../commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';

// 20200502 JustCode: Import the camera module
import Camera, { Constants } from '../../components/camera';
import WordSelector from '../../components/wordSelector';

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import LocalizedStrings from 'react-native-localization';
import localeFile from './locale.json';
let localizedStrings = new LocalizedStrings(localeFile);

// 20210817 JustCode: Redux Toolkit implementation
import { connector, PropsFromRedux } from '../../redux/store/connector';
import {
  pageSearchSetError,
  pageSearchSetLoading,
  pageSearchSetState,
  pageSearchSetUserWord,
  pageSearchShowCamera,
} from '../../redux/slices/page';

type ISearchProps = PropsFromRedux & {
  navigation: any;
};

class Search extends React.Component<ISearchProps> {
  onUserWordChange(text: string) {
    // 20210817 JustCode: Redux Toolkit implementation
    this.props.dispatch(pageSearchSetUserWord(text));
  }

  async onSearch() {
    // 20210817 JustCode: Redux Toolkit implementation
    if (this.props.page.search.userWord.length <= 0) {
      this.props.dispatch(pageSearchSetError(localizedStrings.Error.EmptyWord));
      return;
    }

    try {
      // 20210817 JustCode: Redux Toolkit implementation
      this.props.dispatch(pageSearchSetLoading(true));

      // 20210817 JustCode: Redux Toolkit implementation
      let lemmas = await Api.getLemmas(this.props.page.search.userWord);

      console.log('Lemmas: ', lemmas);
      if (lemmas.success) {
        let headWord = Helper.carefullyGetValue(
          lemmas,
          [
            'payload',
            'results',
            '0',
            'lexicalEntries',
            '0',
            'inflectionOf',
            '0',
            'id',
          ],
          ''
        );
        console.log('Headword is: ', headWord);
        if (headWord.length > 0) {
          let wordDefinition = await Api.getDefinition(headWord);
          if (wordDefinition.success) {
            this.props.dispatch(
              pageSearchSetState({
                errorMsg: '',
                loading: false,
                definition: wordDefinition.payload,
              })
            );
          } else {
            this.props.dispatch(
              pageSearchSetState({
                errorMsg:
                  localizedStrings.Error.OxfordIssue + wordDefinition.message,
                loading: false,
                definition: null,
              })
            );
          }
        } else {
          this.props.dispatch(
            pageSearchSetState({
              errorMsg: localizedStrings.Error.InvalidWord,
              loading: false,
              definition: null,
            })
          );
        }
      } else {
        this.props.dispatch(
          pageSearchSetState({
            errorMsg: localizedStrings.Error.OxfordIssue + lemmas.message,
            loading: false,
            definition: null,
          })
        );
      }
    } catch (error) {
      console.log('Error: ', error);
      this.props.dispatch(
        pageSearchSetState({
          loading: false,
          errorMsg: error.message,
          definition: null,
        })
      );
    }
  }

  // 20200502 JustCode:
  // Receive the recognizedText from the Camera module
  onOCRCapture(recognizedText: string) {
    this.props.dispatch(pageSearchShowCamera(false));

    this.props.dispatch(
      pageSearchSetState({
        showWordList: Helper.isNotNullAndUndefined(recognizedText),
        recognizedText: recognizedText,
      })
    );
  }

  // 20200502 JustCode:
  // Receive the word selected by the user via WordSelector component
  onWordSelected(word: string) {
    this.props.dispatch(
      pageSearchSetState({
        showWordList: false,
        userWord: word,
      })
    );

    if (word.length > 0) {
      setTimeout(() => {
        this.onSearch();
      }, 500);
    }
  }

  render() {
    localizedStrings.setLanguage(this.props.ui.lang);

    return (
      <>
        <SafeAreaView style={commonStyles.content}>
          {/* 20200529 JustCode - Change the hard coded string to localized string */}
          <Header
            navigation={this.props.navigation}
            Title={localizedStrings.Title}
            isAtRoot={true}
          />
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={[commonStyles.column, commonStyles.header]}>
              <Image
                style={commonStyles.logo}
                source={require('../../../assets/icon.png')}
              />
              {/* 20200529 JustCode - Change the hard coded string to localized string */}
              <Text style={commonStyles.sectionTitle}>
                {localizedStrings.SubTitle}
              </Text>
            </View>

            {/*
               20200430 - JustCode:
                 Add camera button to allow user to use camera to capture word. Both the
                 TextInput & TouchableOpacity will be wrapped with a new View.
             */}
            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                onChangeText={text => this.onUserWordChange(text)}
                // 20200529 JustCode - Change the hard coded string to localized string
                placeholder={localizedStrings.PlaceHolder}
                value={this.props.page.search.userWord}
              />
              <TouchableOpacity
                style={styles.searchCamera}
                onPress={() => {
                  // 20210817 JustCode: Redux Toolkit implementation
                  this.props.dispatch(pageSearchShowCamera(true));
                }}>
                <Icon name="ios-camera" size={25} color="#22222288" />
              </TouchableOpacity>
            </View>

            <View style={{ minHeight: 10, maxHeight: 10 }}></View>

            <Button
              // 20200529 JustCode - Change the hard coded string to localized string
              title={localizedStrings.BtnSearch}
              onPress={() => this.onSearch()}
            />

            {
              // 20210817 JustCode: Redux Toolkit implementation
              this.props.page.search.errorMsg.length > 0 && (
                <Text style={commonStyles.errMsg}>
                  {this.props.page.search.errorMsg}
                </Text>
              )
            }

            {/*
               Display word definition as custom component
               // 20210817 JustCode: Redux Toolkit implementation
             */}
            <WordDefinition def={this.props.page.search.definition} />
          </ScrollView>
        </SafeAreaView>
        {
          // 20210817 JustCode: Redux Toolkit implementation
          this.props.page.search.showCamera && (
            <Camera
              cameraType={Constants.Type.back}
              flashMode={Constants.FlashMode.off}
              autoFocus={Constants.AutoFocus.on}
              whiteBalance={Constants.WhiteBalance.auto}
              ratio={'4:3'}
              quality={0.5}
              imageWidth={800}
              enabledOCR={true}
              onCapture={(data: any, recognizedText: any) =>
                this.onOCRCapture(recognizedText)
              }
              onClose={() => {
                // 20210817 JustCode: Redux Toolkit implementation
                this.props.dispatch(pageSearchShowCamera(false));
              }}
            />
          )
        }
        {
          // 20210817 JustCode: Redux Toolkit implementation
          this.props.page.search.showWordList && (
            <WordSelector
              wordBlock={this.props.page.search.recognizedText}
              onWordSelected={(word: any) => this.onWordSelected(word)}
            />
          )
        }
        {
          // 20210817 JustCode: Redux Toolkit implementation
          this.props.page.search.loading && (
            <ActivityIndicator
              style={commonStyles.loading}
              size="large"
              color={'#219bd9'}
            />
          )
        }
      </>
    );
  }
}

// 20210817 JustCode: Redux Toolkit implementation
const ReduxSearch = connector(Search);

export default (props: ISearchProps) => {
  const navigation = useNavigation();

  return (
    // 20210817 JustCode: Redux Toolkit implementation
    // Change Search to ReduxSearch
    <ReduxSearch {...props} navigation={navigation} />
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
  },
  searchInput: {
    padding: 0,
    flex: 1,
  },
  // 20200502 - JustCode:
  // Camera icon style
  searchCamera: {
    maxWidth: 50,
    marginLeft: 5,
    padding: 0,
    alignSelf: 'center',
  },
});
