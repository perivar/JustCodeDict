import Helper from './helper';

const baseURL = 'https://od-api.oxforddictionaries.com/api/v2';
const oxfordAuth = {
  app_id: '8179d10d',
  app_key: 'fd666049a2d24c4a8c0d227da2de037a',
};

interface ILemma {
  success: boolean;
  statusCode: string;
  message: string;
  payload: any;
}

export default class Api {
  static apiRequest(methodName: string, method = 'GET', body = null) {
    if (baseURL.length > 0) {
      // If requestURL is specified, then use it else use the serverURL
      let apiURL = baseURL;
      // If the last character of the apiURL is '/', remove it.
      apiURL =
        apiURL[apiURL.length - 1] === '/'
          ? apiURL.substring(0, apiURL.length - 1)
          : apiURL;

      return fetch(apiURL + '/' + methodName, {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          app_id: oxfordAuth.app_id,
          app_key: oxfordAuth.app_key,
        },
        body:
          method === 'POST' ? (body !== null ? JSON.stringify(body) : '') : '',
      });
    } else {
      return new Promise((resolve, reject) => {
        reject({
          success: false,
          statusCode: 'ERROR',
          message: 'Base URL is not set.',
          payload: null,
        });
      });
    }
  }

  static checkHttpResponse(response: any): any {
    if (response !== null && response !== undefined) {
      if (response.ok) {
        return response.json();
      } else {
        return {
          success: false,
          statusCode: 'HTTP_' + response.status,
          message: Helper.isNotNullAndUndefined(response.statusText)
            ? response.statusText
            : 'Server error: HTTP ' + response.status,
          payload: null,
        };
      }
    } else {
      return {
        success: false,
        statusCode: 'HTTP_NORESPONSE',
        message: 'No response from the request.',
        payload: null,
      };
    }
  }

  static getLemmas(word: string): Promise<ILemma> {
    return new Promise((resolve, reject) => {
      this.apiRequest('lemmas/en/' + word.toLowerCase())
        .then(response => this.checkHttpResponse(response))
        .then(responseJson => {
          console.log('Response JSON: ', responseJson);
          resolve({
            success: true,
            statusCode: 'HTTP_200',
            message: '',
            payload: responseJson,
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static getDefinition(word: string): Promise<ILemma> {
    return new Promise((resolve, reject) => {
      this.apiRequest('entries/en/' + word.toLowerCase())
        .then(response => this.checkHttpResponse(response))
        .then(responseJson => {
          resolve({
            success: true,
            statusCode: 'HTTP_200',
            message: '',
            payload: responseJson,
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
