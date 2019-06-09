let {FB, FacebookApiException} = require('fb');
let AuthenticationError = require('../errors/authentication-error');

let doFacebookAuth = (access_token) => {
    return new Promise((resolve, reject) => {
      
      FB.setAccessToken(access_token);
      FB.api(
        '/me',
        'GET',
        {"fields":"id,email"},
        (fbres) => {
          if(!fbres || fbres.error) {
              let e = !fbres ? 'Unknown error' : fbres.error;
              reject(new AuthenticationError(`Facebook auth error: ${e.message}`, { param: 'access_token', code: 'USR_01' }))
              return;
          }
  
          if(fbres.error) {
            reject(new AuthenticationError(`Facebook auth error: ${fbres.error.message}`, { param: 'access_token', code: 'USR_01' }))
          } else {
              resolve(fbres);
          }
          
        });
    });
  }

  module.exports = { doFacebookAuth };