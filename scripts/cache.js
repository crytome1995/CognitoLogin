var USERNAME = "username";
var ID = "cogID";

export function addUserName(username) {
  localStorage[USERNAME] = username;
}

export function getUserName() {
  return localStorage[USERNAME];
}

export function addIDToken(idToken) {
  localStorage[ID] = idToken;
}

export function getIDToken() {
  return localStorage[ID];
}
