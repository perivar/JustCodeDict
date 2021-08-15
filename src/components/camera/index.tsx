import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Platform,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import LocalizedStrings from 'react-native-localization';
import localeFile from './locale.json';
let localizedStrings = new LocalizedStrings(localeFile);

export const Constants = {
  ...RNCamera.Constants,
};

interface ICameraProps {
  cameraType: any;
  flashMode: any;
  autoFocus: any;
  whiteBalance: any;
  ratio: any;
  quality: any;
  imageWidth: any;
  style: any;
  onCapture: any;
  enabledOCR: any;
  onClose: any;
  lang: any;
}

interface ICameraState {
  cameraType: any;
  flashMode: any;
  recognizedText: any;
}

export default class Camera extends React.Component<
  ICameraProps,
  ICameraState
> {
  static propTypes: ICameraProps = {
    cameraType: PropTypes.any,
    flashMode: PropTypes.any,
    autoFocus: PropTypes.any,
    whiteBalance: PropTypes.any,
    ratio: PropTypes.string,
    quality: PropTypes.number,
    imageWidth: PropTypes.number,
    style: PropTypes.object,
    onCapture: PropTypes.func,
    enabledOCR: PropTypes.bool,
    onClose: PropTypes.func,
    lang: PropTypes.string, // 20200529 JustCode - Add in lang props
  };

  static defaultProps: ICameraProps = {
    cameraType: Constants.Type.back,
    flashMode: Constants.FlashMode.off,
    autoFocus: Constants.AutoFocus.on,
    whiteBalance: Constants.WhiteBalance.auto,
    ratio: '4:3',
    quality: 0.5,
    imageWidth: 768,
    style: null,
    onCapture: null,
    enabledOCR: false,
    onClose: null,
    lang: 'en', // 20200529 JustCode - Set en as default lang
  };

  camera: RNCamera = null;
  state: ICameraState = {
    cameraType: Constants.Type.back,
    flashMode: Constants.FlashMode.off,
    recognizedText: null,
  };

  componentDidMount() {
    this.setState({
      // If enabledOCR is true, then set the cameraType to back only
      cameraType: this.props.enabledOCR
        ? Constants.Type.back
        : this.props.cameraType,
      flashMode: this.props.flashMode,
      recognizedText: null,
    });
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: this.props.quality,
        base64: true,
        width: this.props.imageWidth,
        doNotSave: true,
        fixOrientation: true,
        pauseAfterCapture: true,
      };
      const data = await this.camera.takePictureAsync(options);

      this.props.onCapture &&
        this.props.onCapture(data.base64, this.state.recognizedText);
    }
  };

  onTextRecognized(data: any) {
    if (this.props.enabledOCR) {
      console.log('onTextRecognized: ', data);
      if (data && data.textBlocks && data.textBlocks.length > 0) {
        this.setState({ recognizedText: data });
      }
    }
  }

  render() {
    // 20200529 JustCode: Set the language pass in via props
    localizedStrings.setLanguage(this.props.lang);

    return (
      <View style={[styles.camera.container, this.props.style]}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.camera.preview}
          type={this.state.cameraType}
          flashMode={this.state.flashMode}
          ratio={this.props.ratio}
          captureAudio={false}
          autoFocus={this.props.autoFocus}
          whiteBalance={this.props.whiteBalance}
          androidCameraPermissionOptions={{
            // 20200529 JustCode - Change the hard coded string to localized string
            title: localizedStrings.Camera.Permission.Title,
            message: localizedStrings.Camera.Permission.Message,
            buttonPositive: localizedStrings.Camera.Permission.BtnOK,
            buttonNegative: localizedStrings.Camera.Permission.BtnCancel,
          }}
          androidRecordAudioPermissionOptions={{
            // 20200529 JustCode - Change the hard coded string to localized string
            title: localizedStrings.Audio.Permission.Title,
            message: localizedStrings.Audio.Permission.Message,
            buttonPositive: localizedStrings.Audio.Permission.BtnOK,
            buttonNegative: localizedStrings.Audio.Permission.BtnCancel,
          }}
          onTextRecognized={
            this.props.enabledOCR
              ? data => this.onTextRecognized(data)
              : undefined
          }
        />

        <View
          style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.camera.capture}
            onPress={() => {
              switch (this.state.flashMode) {
                case Constants.FlashMode.off:
                  this.setState({ flashMode: Constants.FlashMode.auto });
                  break;

                case Constants.FlashMode.auto:
                  this.setState({ flashMode: Constants.FlashMode.on });
                  break;

                case Constants.FlashMode.on:
                  this.setState({ flashMode: Constants.FlashMode.off });
                  break;
              }
            }}>
            <Image
              source={
                this.state.flashMode === Constants.FlashMode.auto
                  ? require('../../../assets/camera/flashAuto.png')
                  : this.state.flashMode === Constants.FlashMode.on
                  ? require('../../../assets/camera/flashOn.png')
                  : require('../../../assets/camera/flashOff.png')
              }
              style={{ width: 30, height: 30 }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.camera.capture}>
            <Image
              source={require('../../../assets/camera/cameraButton.png')}
              style={{ width: 50, height: 50 }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {
            // If enabledOCR is true, don't allow user to change camera
            !this.props.enabledOCR ? (
              <TouchableOpacity
                style={styles.camera.capture}
                onPress={() => {
                  if (this.state.cameraType === Constants.Type.back) {
                    this.setState({ cameraType: Constants.Type.front });
                  } else {
                    this.setState({ cameraType: Constants.Type.back });
                  }
                }}>
                <Image
                  source={require('../../../assets/camera/cameraFlipIcon.png')}
                  style={{ width: 40, height: 40 }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.camera.capture,
                  { width: 70, height: 70 },
                ]}></View>
            )
          }
        </View>
        {this.props.onClose && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              this.props.onClose && this.props.onClose();
            }}>
            <Icon name={'ios-close'} style={styles.closeButtonIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = {
  camera: {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: 'black',
    } as ViewStyle,
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    } as ViewStyle,
    capture: {
      flex: 0,
      // backgroundColor: '#f00',
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    } as ViewStyle,
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: '#aaaaaab0',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    top: Platform.OS === 'ios' ? 45 : 10,
    left: 10,
  } as ViewStyle,
  closeButtonIcon: {
    fontSize: Platform.OS === 'ios' ? 40 : 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    lineHeight: Platform.OS === 'ios' ? 58 : 40,
  } as ViewStyle,
};
