import * as cache from "./cache.js";

var USER = "user";
var CARD_NAME = "cardName";
var GATEWAY_URL = "https://ynotyi3yac.execute-api.us-east-2.amazonaws.com/dev/";
var POST_CARD_RESOURCE_PATH = "card";
var GET_CARDS_RESOURCE_PATH = "card/";
var POST = "POST";

function getAddCardJSON(cardName) {
  var json = {
    [USER]: cache.getUserName(),
    [CARD_NAME]: cardName,
  };
  return JSON.stringify(json);
}

function setHeaders(client) {
  client.setRequestHeader("Content-type", "application/json");
  client.setRequestHeader("Authorization", cache.getIDToken());
  return client;
}

export function addCard(cardName) {
  let url = GATEWAY_URL.concat(POST_CARD_RESOURCE_PATH);
  let client = new XMLHttpRequest();
  client.open(POST, url);
  client = setHeaders(client);
  client.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log("ADDED CARD");
    } else {
      console.log(this);
    }
  };
  client.send(getAddCardJSON("ethan"));
}

export function getCards(callback) {
  return new Promise(function (resolve, reject) {
    var cardResponse;
    let url = GATEWAY_URL.concat(
      GET_CARDS_RESOURCE_PATH,
      encodeURIComponent(cache.getUserName())
    );
    let client = new XMLHttpRequest();
    client.open(POST, url);
    client = setHeaders(client);
    client.onload = resolve;
    client.onreadystatechange = function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log(this.responseText);
      } else {
        console.log(this);
      }
    };
    client.send();
  });
}
