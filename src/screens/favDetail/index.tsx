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

interface IFavDetailProps {
  navigation: any;
  route: any;
  lang: string;
}

interface IFavDetailState {
  errorMsg: string;
  loading: boolean;
  definition: any;
}

class FavDetail extends React.Component<IFavDetailProps, IFavDetailState> {
  constructor(props: IFavDetailProps) {
    super(props);
    this.state = { errorMsg: '', loading: false, definition: null };
  }

  componentDidMount() {
    if (Helper.isNotNullAndUndefined(this.props, ['route', 'params', 'word'])) {
      this.getDefinition(this.props.route.params.word);
    }
  }

  async getDefinition(word: string) {
    try {
      this.setState({ loading: true });

      if (word.length > 0) {
        let wordDefinition = await Api.getDefinition(word);
        if (wordDefinition.success) {
          this.setState({
            errorMsg: '',
            loading: false,
            definition: wordDefinition.payload,
          });
          console.log('Word Definition: ', wordDefinition.payload);
        } else {
          // 20200529 JustCode - Change the hard coded string to localized string
          this.setState({
            errorMsg:
              localizedStrings.Error.OxfordIssue + wordDefinition.message,
            loading: false,
            definition: null,
          });
        }
      } else {
        // 20200529 JustCode - Change the hard coded string to localized string
        this.setState({
          errorMsg: localizedStrings.Error.InvalidWord,
          loading: false,
          definition: null,
        });
      }
    } catch (error) {
      console.log('Error: ', error);
      this.setState({
        loading: false,
        errorMsg: error.message,
        definition: null,
      });
    }
  }

  render() {
    // 20200529 JustCode: Set the language pass in via props
    localizedStrings.setLanguage(this.props.lang);

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

            {this.state.errorMsg.length > 0 && (
              <Text style={commonStyles.errMsg}>{this.state.errorMsg}</Text>
            )}

            {/* Display word definition as custom component */}
            <WordDefinition def={this.state.definition} hideFav={true} />
          </ScrollView>
        </SafeAreaView>
        {this.state.loading && (
          <ActivityIndicator
            style={commonStyles.loading}
            size="large"
            color={'#219bd9'}
          />
        )}
      </>
    );
  }
}

export default function (props: IFavDetailProps) {
  const navigation = useNavigation();
  const route = useRoute();

  return <FavDetail {...props} navigation={navigation} route={route} />;
}
