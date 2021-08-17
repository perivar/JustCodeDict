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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Api from '../../lib/api';
import Helper from '../../lib/helper';
import WordDefinition from '../../components/wordDef';
import commonStyles from '../../../commonStyles';
import Header from '../../components/header';

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import LocalizedStrings from 'react-native-localization';
import localeFile from './locale.json';
let localizedStrings = new LocalizedStrings(localeFile);

// 20210817 JustCode: Redux Toolkit implementation
import { connector, PropsFromRedux } from '../../redux/store/connector';
import {
  pageFavDetailSetLoading,
  pageFavDetailSetState,
} from '../../redux/slices/page';

type FavDetailProps = PropsFromRedux & {
  navigation: any;
  route: any;
  lang: string;
};

class FavDetail extends React.Component<FavDetailProps> {
  componentDidMount() {
    if (Helper.isNotNullAndUndefined(this.props, ['route', 'params', 'word'])) {
      this.getDefinition(this.props.route.params.word);
    }
  }

  async getDefinition(word: string) {
    try {
      // 20210817 JustCode: Redux Toolkit implementation
      this.props.dispatch(pageFavDetailSetLoading(true));

      if (word.length > 0) {
        let wordDefinition = await Api.getDefinition(word);
        if (wordDefinition.success) {
          // 20210817 JustCode: Redux Toolkit implementation
          this.props.dispatch(
            pageFavDetailSetState({
              errorMsg: '',
              loading: false,
              definition: wordDefinition.payload,
            })
          );
        } else {
          // 20210817 JustCode: Redux Toolkit implementation
          this.props.dispatch(
            pageFavDetailSetState({
              errorMsg:
                localizedStrings.Error.OxfordIssue + wordDefinition.message,
              loading: false,
              definition: null,
            })
          );
        }
      } else {
        // 20210817 JustCode: Redux Toolkit implementation
        this.props.dispatch(
          pageFavDetailSetState({
            errorMsg: localizedStrings.Error.InvalidWord,
            loading: false,
            definition: null,
          })
        );
      }
    } catch (error) {
      // 20210817 JustCode: Redux Toolkit implementation
      this.props.dispatch(
        pageFavDetailSetState({
          errorMsg: error.message,
          loading: false,
          definition: null,
        })
      );
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
          />
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={[commonStyles.column, commonStyles.header]}>
              <Image
                style={commonStyles.logo}
                source={require('../../../assets/icon.png')}
              />
            </View>

            <View style={{ minHeight: 10, maxHeight: 10 }}></View>

            {
              // 20210817 JustCode: Redux Toolkit implementation
              this.props.page.favDetail.errorMsg.length > 0 && (
                <Text style={commonStyles.errMsg}>
                  {this.props.page.favDetail.errorMsg}
                </Text>
              )
            }

            {/* Display word definition as custom component
                 20210817 JustCode: Redux Toolkit implementation
             */}
            <WordDefinition
              def={this.props.page.favDetail.definition}
              hideFav={true}
            />
          </ScrollView>
        </SafeAreaView>
        {
          // 20210817 JustCode: Redux Toolkit implementation
          this.props.page.fav.loading && (
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
const ReduxFavDetail = connector(FavDetail);

export default function (props: FavDetailProps) {
  const navigation = useNavigation();
  const route = useRoute();

  return <ReduxFavDetail {...props} navigation={navigation} route={route} />;
}
