var USERNAME = "username";
var ID = "cogID";
var CARDS = "cards";

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

export function addCardNames(cards) {
  localStorage[CARDS] = JSON.stringify(cards);
}
export function addCardName(cardName) {
  let cardNames = JSON.parse(localStorage[CARDS]);
  if (cardName) {
    cardNames.push(cardName);
    localStorage[CARDS] = JSON.stringify(cardNames);
  }
}
export function getCardNames() {
  return JSON.parse(localStorage[CARDS]);
}
