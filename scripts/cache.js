export { cache };
var USERNAME = "username";
var ID = "cogID";
var CARDS = "cards";
var TRANSACTIONS = "transactions";
var SESSION = "session";
var cache = {
  set session(validity) {
    localStorage[SESSION] = validity;
  },

  get session() {
    return localStorage[SESSION];
  },

  set user(userName) {
    localStorage[USERNAME] = userName;
  },

  get user() {
    return localStorage[USERNAME];
  },

  set token(idToken) {
    localStorage[ID] = idToken;
  },

  get token() {
    return localStorage[ID];
  },

  addCard: function (cardName) {
    let cardNames = JSON.parse(localStorage[CARDS]);
    if (cardName) {
      cardNames.push(cardName);
      localStorage[CARDS] = JSON.stringify(cardNames);
    }
  },

  removeCard: function (cardName) {
    let currentCards = JSON.parse(localStorage[CARDS]);
    for (let i = 0; i < currentCards.length; i++) {
      if (currentCards[i] == cardName) {
        currentCards.splice(i, 1);
        break;
      }
    }
    localStorage[CARDS] = JSON.stringify(currentCards);
  },

  set cards(cardList) {
    localStorage[CARDS] = JSON.stringify(cardList);
  },

  get cards() {
    return JSON.parse(localStorage[CARDS]);
  },

  set transactions(transactionList) {
    localStorage[TRANSACTIONS] = JSON.stringify(transactionList);
  },

  get transactions() {
    return JSON.parse(localStorage[TRANSACTIONS]);
  },
};

export function cardExists(cardName) {
  let currentCards = JSON.parse(localStorage[CARDS]);
  for (let i = 0; i < currentCards.length; i++) {
    if (currentCards[i] == cardName) {
      return true;
    }
  }
  return false;
}
