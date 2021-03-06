import { cache } from "./cache.js";
var CLIENT_ID = "6pc97ak94tqu191cjc4vuggpkt";
var POOL_ID = "us-east-2_1D0fK5PX0";
var IDENTITY_POOL_ID = "us-east-2:195e1f62-8dd2-431a-8dd0-61822d856379";
var REGION = "us-east-2";
var ACCOUNT_ID = "982658172500";
var COGNITO_URL = "".concat("cognito-idp.", REGION, ".amazonaws.com/", POOL_ID);
AWS.config.region = REGION;
// data related to the user pool in ethan_and_tara
var poolData = {
  UserPoolId: POOL_ID,
  ClientId: CLIENT_ID,
};

function storeUsername(userAttributes) {
  for (var i = 0; i < userAttributes.length; i++) {
    let name = userAttributes[i].getName();
    if (name == "email") {
      cache.user = userAttributes[i].getValue();
      break;
    }
  }
}
/**
 * TODO: CHANGE TO RETURNING A TOKEN
 */
// check if the user is still valid in cognito
export function checkSession() {
  return new Promise((resolve, reject) => {
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    var validSession = false;
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          window.location.href = "/index.html";
          resolve();
        }
        console.log("session validity: " + session.isValid());
        var jwt = session.getIdToken().getJwtToken();
        var idToken = session.getIdToken().getJwtToken();
        console.log(session);
        cache.token = idToken;
        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        cognitoUser.getUserAttributes(function (err, attributes) {
          if (err) {
            console.log(err);
            window.location.href = "/index.html";
            resolve();
          } else {
            storeUsername(attributes);
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: IDENTITY_POOL_ID,
              Logins: {
                // have to pass as string for some reaon...
                "cognito-idp.us-east-2.amazonaws.com/us-east-2_1D0fK5PX0": jwt,
              },
            });
            AWS.config.credentials.get(function (err) {
              if (err) {
                console.log(err.message);
                window.location.href = "/index.html";
              } else {
                // console.log(
                //   "AWS Access Key: " + AWS.config.credentials.accessKeyId
                // );
                // console.log(
                //   "AWS Secret Key: " + AWS.config.credentials.secretAccessKey
                // );
                // console.log(
                //   "AWS Session Token: " + AWS.config.credentials.sessionToken
                // );
              }
            });
            validSession = true;
          }
          cache.session = validSession;
          if (validSession && window.location.href.includes("index.html")) {
            window.location.href = "/budget.html";
            resolve();
          } else {
            resolve();
          }
        });
      });
    } else {
      console.log(e);
      let windowHref = window.location.href;
      if (!windowHref.includes("index.html")) {
        alert("Session has expired returning to login!");
        window.location.href = "/index.html";
        resolve();
      }
    }
  });
}

export function login() {
  return new Promise((resolve, reject) => {
    // get user credentials
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username && password) {
      // user pool resource in AWS
      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      // auth map for user
      let authData = {
        Username: username,
        Password: password,
      };
      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authData
      );
      // what user pool user belongs to
      let userData = {
        Username: username,
        Pool: userPool,
      };
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          var accessToken = result.getAccessToken().getJwtToken();
          result.get;
          document.cookie = accessToken;
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IDENTITY_POOL_ID, // your identity pool id here
            Logins: {
              // Change the key below according to the specific region your user pool is in.
              COGNITO_URL: result.getIdToken().getJwtToken(),
            },
          });
          resolve();
        },
        onFailure: function (err) {
          alert(err.message || JSON.stringify(err));
          reject(err);
        },
        mfaRequired: (codeDeliveryDetails) => {
          // By this point, Cognito has SMS'd the user
          // Since we have access to a CognitoUser object during the login process
          // we have to request the SMS input *here* from the user.
          // The web examples I've seen suggest having a `confirm()` prompt
          // or react-native example I've seen suggest similar prompt libraries
          // for example:
          // const mfaCode = prompt("Enter your SMS MFA Code");
          // cognitoUser.sendMFACode(
          //   mfaCode,
          //   {
          //     onSuccess: (result) => "e",
          //     onFailure: (err) => "e",
          //   },
          //   "SMS_MFA"
          // );
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // the api doesn't accept this field back
          delete userAttributes.email_verified;

          // unsure about this field, but I don't send this back
          delete userAttributes.phone_number_verified;
          // Get these details and call
          cognitoUser.completeNewPasswordChallenge(
            password,
            userAttributes,
            this
          );
        },
      });
    } else {
      reject("Invalid username and or password");
    }
  });
}
