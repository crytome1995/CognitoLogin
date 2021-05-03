import * as cache from "./cache.js";
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
      cache.addUserName(userAttributes[i].getValue());
      break;
    }
  }
}

// check if the user is still valid in cognito
export function checkLoginSession() {
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log("session validity: " + session.isValid());
      var jwt = session.getIdToken().getJwtToken();
      var idToken = session.getIdToken().getJwtToken();
      console.log(session);
      cache.addIDToken(idToken);
      // NOTE: getSession must be called to authenticate user before calling getUserAttributes
      cognitoUser.getUserAttributes(function (err, attributes) {
        if (err) {
          console.log(err);
          return;
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
            } else {
              console.log(
                "AWS Access Key: " + AWS.config.credentials.accessKeyId
              );
              console.log(
                "AWS Secret Key: " + AWS.config.credentials.secretAccessKey
              );
              console.log(
                "AWS Session Token: " + AWS.config.credentials.sessionToken
              );
            }
          });
          window.location.href = "/budget.html";
        }
      });
    });
  }
}

function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if (username && password) {
    // user pool resource in AWS
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    let authData = {
      Username: username,
      Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authData
    );
    let userData = {
      Username: username,
      Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        result.get;
        setCookies(accessToken);
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: IDENTITY_POOL_ID, // your identity pool id here
          Logins: {
            // Change the key below according to the specific region your user pool is in.
            COGNITO_URL: result.getIdToken().getJwtToken(),
          },
        });
        window.location.href = "/budget.html";
      },
      onFailure: function (err) {
        alert(err.message || JSON.stringify(err));
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
    });
  } else {
    window.alert("Please enter your username and password!");
  }
}
//var cognitoidentity = new AWS.CognitoIdentity({apiVersion: '2014-06-30'});