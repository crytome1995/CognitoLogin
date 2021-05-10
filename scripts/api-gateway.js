import * as cache from "./cache.js";

var USER = "user";
var CARD_NAME = "cardName";
var CARD = "card";
var BUSINESS = "business";
var AMOUNT = "amount";
var DATE = "date";
var UUID = "uuid";
var GATEWAY_URL = "https://ynotyi3yac.execute-api.us-east-2.amazonaws.com/dev/";
var POST_CARD_RESOURCE_PATH = "card";
var GET_CARDS_RESOURCE_PATH = "card/";
var TRANSACTIONS_PATH = "/transactions";
var POST = "POST";
var GET = "GET";

// return a json request representation for a card put request
function getAddCardJSON(cardName) {
  var json = {
    [USER]: cache.getUserName(),
    [CARD_NAME]: cardName,
  };
  return JSON.stringify(json);
}

function getAddTransactionJSON(card, business, amount, date) {
  let uuid = "xxxx-xxxx-xxx-xxxx".replace(/[x]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
  var json = {
    [USER]: cache.getUserName(),
    [UUID]: uuid,
    [DATE]: date,
    [CARD]: card,
    [BUSINESS]: business,
    [AMOUNT]: amount,
  };
  return JSON.stringify(json);
}

// set client headers for interacting with the api gateway
function setHeaders(client) {
  client.setRequestHeader("Content-type", "application/json");
  client.setRequestHeader("Authorization", cache.getIDToken());
  return client;
}

// get all transactions by user
export function getTransactionsByUser() {
  return new Promise(function (resolve, reject) {
    let url = GATEWAY_URL.concat(TRANSACTIONS_PATH, "/", cache.getUserName());
    let client = new XMLHttpRequest();
    client.open(GET, url, false);
    client = setHeaders(client);
    client.onload = resolve;
    client.onreadystatechange = function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log("Obtained transactions for user!");
      } else {
        console.log(this);
        reject(alert("Something went wrong when getting transactions!"));
      }
    };
    client.send();
  });
}

// add a new transaction to the table
export function addUserTransaction(card, business, amount, date) {
  return new Promise(function (resolve, reject) {
    let url = GATEWAY_URL.concat(TRANSACTIONS_PATH, "/", cache.getUserName());
    let client = new XMLHttpRequest();
    let json = getAddTransactionJSON(card, business, amount, date);
    client.open(POST, url, false);
    client = setHeaders(client);
    client.onload = resolve;
    client.onreadystatechange = function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log("Added transaction for user!");
        resolve(JSON.parse(json));
      } else {
        console.log(this);
        reject(alert("Something went wrong when adding transactions!"));
      }
    };
    client.send(json);
  });
}

// add a card to the database
export function addCard(cardName) {
  return new Promise(function (resolve, reject) {
    let url = GATEWAY_URL.concat(POST_CARD_RESOURCE_PATH);
    let client = new XMLHttpRequest();
    client.open(POST, url, false);
    client = setHeaders(client);
    client.onload = resolve;
    client.onreadystatechange = function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log("Added card with cardName: " + cardName);
      } else {
        console.log(this);
        alert("Something went wrong when adding card!");
      }
    };
    client.send(getAddCardJSON(cardName));
  });
}

// return all cards that belong to the logged in user
export function getCards(callback) {
  return new Promise(function (resolve, reject) {
    var cardResponse;
    let url = GATEWAY_URL.concat(
      GET_CARDS_RESOURCE_PATH,
      encodeURIComponent(cache.getUserName())
    );
    let client = new XMLHttpRequest();
    client.open(POST, url, false);
    client = setHeaders(client);
    client.onload = resolve;
    client.onreadystatechange = function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log("Got response: " + this.responseText);
      } else {
        console.log("Error: " + this);
        reject(alert("API ERROR on getting cards!"));
      }
    };
    client.send();
  });
}

// delete a card from the database
export function deleteCard(cardName) {
  return new Promise(function (resolve, reject) {
    let url = GATEWAY_URL.concat(
      GET_CARDS_RESOURCE_PATH,
      encodeURIComponent(cache.getUserName()),
      "/",
      cardName
    );
    let client = new XMLHttpRequest();
    client.open(POST, url, false);
    client = setHeaders(client);
    client.onload = resolve;
    client.onreadystatechange = function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log("Got response: " + this.responseText);
      } else {
        console.log("Error: " + this);
        reject(
          alert(
            "Failed to remove card with name: " + cardName + " please try again"
          )
        );
      }
    };
    client.send();
  });
}
