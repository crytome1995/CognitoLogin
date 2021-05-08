var USERNAME = "username";
var ID = "cogID";
var CARDS = "cards";
var TRANSACTIONS = "transactions";

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

export function cardExists(cardName) {
  let currentCards = JSON.parse(localStorage[CARDS]);
  for (let i = 0; i < currentCards.length; i++) {
    if (currentCards[i] == cardName) {
      return true;
    }
  }
  return false;
}

export function removeCardName(cardName) {
  let currentCards = JSON.parse(localStorage[CARDS]);
  for (let i = 0; i < currentCards.length; i++) {
    if (currentCards[i] == cardName) {
      currentCards.splice(i, 1);
      break;
    }
  }
  localStorage[CARDS] = JSON.stringify(currentCards);
}

export function addTransactions(transactions) {
  localStorage[TRANSACTIONS] = JSON.stringify(transactions);
}

export function getTransactions() {
  return JSON.parse(localStorage[TRANSACTIONS]);
}
