/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/header';
import commonStyles from '../../../commonStyles';

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import LocalizedStrings from 'react-native-localization';
import { TouchableOpacity } from 'react-native-gesture-handler';
import localeFile from './locale.json';
let localizedStrings = new LocalizedStrings(localeFile);

// 20210817 JustCode: Redux Toolkit implementation
import { connector, PropsFromRedux } from '../../redux/store/connector';
import { setLanguage } from '../../redux/slices/ui';

type ISettingProps = PropsFromRedux & {
  navigation: any;
};

class Setting extends React.Component<ISettingProps> {
  updateLanguage(lang: string) {
    // 20210817 JustCode: Redux Toolkit implementation
    this.props.dispatch(setLanguage(lang));
  }

  render() {
    // 20210817 JustCode: Redux Toolkit implementation
    localizedStrings.setLanguage(this.props.ui.lang);

    return (
      <>
        <SafeAreaView style={commonStyles.content}>
          <Header
            navigation={this.props.navigation}
            Title={localizedStrings.title}
            isAtRoot={true}
          />
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.prompt}>
              <Text>{localizedStrings.desc}</Text>
            </View>
            <View style={styles.language}>
              <TouchableOpacity
                style={
                  localizedStrings.getLanguage() === 'en'
                    ? styles.langButtonSelected
                    : styles.langButton
                }
                onPress={() => this.updateLanguage('en')}>
                <Text style={styles.buttonFlag}>🇬🇧</Text>
                <Text style={styles.buttonText}>
                  {localizedStrings.language.english}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  localizedStrings.getLanguage() === 'zh'
                    ? styles.langButtonSelected
                    : styles.langButton
                }
                onPress={() => this.updateLanguage('zh')}>
                <Text style={styles.buttonFlag}>🇨🇳</Text>
                <Text style={styles.buttonText}>
                  {localizedStrings.language.chinese}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  localizedStrings.getLanguage() === 'kr'
                    ? styles.langButtonSelected
                    : styles.langButton
                }
                onPress={() => this.updateLanguage('kr')}>
                <Text style={styles.buttonFlag}>🇰🇷</Text>
                <Text style={styles.buttonText}>
                  {localizedStrings.language.korean}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  prompt: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  language: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 30,
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    height: 50,
    width: 150,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#219bd9',
  },
  langButtonSelected: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    height: 50,
    width: 150,
    margin: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#219bd9',
  },
  buttonFlag: {
    flex: 1,
    fontSize: 30,
    justifyContent: 'center',
  },
  buttonText: {
    flex: 2,
    fontSize: 20,
    justifyContent: 'center',
    color: '#219bd9',
    textAlign: 'center',
  },
});

// 20210817 JustCode: Redux Toolkit implementation
const ReduxSetting = connector(Setting);

export default (props: ISettingProps) => {
  const navigation = useNavigation();

  return (
    // 20210817 JustCode: Redux Toolkit implementation
    // Change Setting to ReduxSetting
    <ReduxSetting {...props} navigation={navigation} />
  );
};
