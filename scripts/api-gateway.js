import { cache } from "./cache.js";
import { cardApiModels, transactionApiModels } from "./api-representations.js";
import { generateUUID } from "./util.js";
var POST = "POST";
var GET = "GET";
var DELETE = "DELETE";

// set client headers for interacting with the api gateway
function setHeaders(client) {
  client.setRequestHeader("Content-type", "application/json");
  client.setRequestHeader("Authorization", cache.token);
  return client;
}
var cardsApi = function () {
  var GATEWAY_URL_CARDS =
    "https://s1hk5ru6h4.execute-api.us-east-2.amazonaws.com/dev/";
  var CARDS_PATH = "card/";
  var CARD_PATH = "card";
  var client;
  /**
   * Construct the URI for the get all user cards api call
   * @param {String} username username
   */
  function userCardsURI(username) {
    return GATEWAY_URL_CARDS + CARDS_PATH + cache.user;
  }

  /**
   * Construct the URI for adding a card for a user
   */
  function postUserCardURI(userName) {
    return GATEWAY_URL_CARDS + CARD_PATH + "/" + userName;
  }

  /**
   * Construct the URI for deleting a card for a user
   * @param {String} userName user
   * @param {String} cardName  name of card
   */
  function deleteUserCardURI(userName, cardName) {
    return GATEWAY_URL_CARDS + CARDS_PATH + userName + "/" + cardName;
  }

  /**
   * Query all cards cards that belong to the logged in user
   */
  function queryUserCards() {
    let userName = cache.user;
    console.log("Obtaining all cards for user: " + userName);
    let url = userCardsURI(encodeURIComponent(userName));
    let client = new XMLHttpRequest();
    client.open(GET, url, false);
    client = setHeaders(client);
    return new Promise(function (resolve, reject) {
      client.onload = resolve;
      client.onreadystatechange = function () {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log("Obtained cards for user: " + userName);
          console.log(this);
          resolve(this);
        } else {
          reject(alert("Failed to get due to : [ " + this.responseText + " ]"));
        }
      };
      client.send();
    });
  }

  /**
   * Add a users card to the database
   * @param {String} cardName name of card to add for user
   */
  function addUserCard(cardName) {
    let userName = cache.user;
    console.log("Adding card: " + cardName + " for user: " + userName);
    let url = postUserCardURI(encodeURIComponent(userName));
    let client = new XMLHttpRequest();
    let json = cardApiModels().addCardRequest(cardName);
    client.open(POST, url, false);
    client = setHeaders(client);
    return new Promise(function (resolve, reject) {
      client.onload = resolve;
      client.onreadystatechange = function () {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log(
            "Added card for user: " + userName + " with cardName: " + cardName
          );
          resolve();
        } else {
          reject(
            alert("Failed to add card due to : [ " + this.responseText + " ]")
          );
        }
      };
      client.send(json);
    });
  }

  /**
   * Remove a card from the database for a user
   * @param {String} cardName name of card to delete
   */
  function removeCard(cardName) {
    let userName = cache.user;
    console.log("Deleting card: " + cardName + " for user: " + userName);
    let url = deleteUserCardURI(userName, cardName);
    let client = new XMLHttpRequest();
    client.open(DELETE, url, false);
    client = setHeaders(client);
    return new Promise(function (resolve, reject) {
      client.onload = resolve;
      client.onreadystatechange = function () {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log("Removed card: " + cardName);
        } else {
          reject(
            alert(
              "Failed to remove card with name: " +
                cardName +
                " please try again"
            )
          );
        }
      };
      client.send();
    });
  }

  return {
    queryUserCards: queryUserCards,
    addUserCard: addUserCard,
    removeCard: removeCard,
  };
};

var transactionsApi = function () {
  var TRANSACTIONS_PATH = "transactions";
  var GATEWAY_URL_TRANSACTIONS =
    " https://dau2cuwnfe.execute-api.us-east-2.amazonaws.com/dev/";
  /**
   * Construct the URI for obtaining all transactions for a user
   * @param {String} userName name of the user
   */
  function transactionsByUserURI(userName) {
    return GATEWAY_URL_TRANSACTIONS + TRANSACTIONS_PATH + "/" + userName;
  }

  function addUserTransactionURI(userName) {
    return GATEWAY_URL_TRANSACTIONS + TRANSACTIONS_PATH + "/" + userName;
  }

  /**
   * Obtain all transactions based on a user
   */
  function getUsersTransactions() {
    let userName = cache.user;
    console.log("Obtaining all transactions for user: " + userName);
    let url = transactionsByUserURI(userName);
    let client = new XMLHttpRequest();
    client.open(GET, url, false);
    client = setHeaders(client);
    return new Promise(function (resolve, reject) {
      client.onload = resolve;
      client.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log("Obtained transactions for user: " + userName);
          resolve(this);
        } else {
          reject(
            alert(
              "Failed to get transactions for user: " +
                userName +
                " please reload the page!"
            )
          );
        }
      };
      client.send();
    });
  }

  /**
   *  Add a transaction to the table
   * @param {String} card name of card attached to transaction
   * @param {String} business place of purchase
   * @param {Number} amount  amount spent
   * @param {String} date when transaction occured
   */
  function addUserTransaction(card, business, amount, date) {
    let userName = cache.user;
    console.log("Adding transaction for user: " + userName);
    let url = addUserTransactionURI(userName);
    let client = new XMLHttpRequest();
    let json = transactionApiModels().addTransacionRequest(
      generateUUID(),
      userName,
      date,
      card,
      business,
      amount
    );
    client.open(POST, url, false);
    client = setHeaders(client);
    return new Promise(function (resolve, reject) {
      client.onload = resolve;
      client.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log("Added transaction for user: " + userName);
          resolve(JSON.parse(json));
        } else {
          reject(
            alert(
              "Failed to add transactions for user: " +
                userName +
                " please try again!"
            )
          );
        }
      };
      client.send(json);
    });
  }

  /**
   *  Edit a transaction and add to table
   * @param {String} card name of card attached to transaction
   * @param {String} business place of purchase
   * @param {Number} amount  amount spent
   * @param {String} date when transaction occured
   * @param {String} uuid unique id of transaction
   */
  function editUserTransaction(card, business, amount, date, uuid) {
    let userName = cache.user;
    console.log("Adding transaction for user: " + userName);
    let url = addUserTransactionURI(userName);
    let client = new XMLHttpRequest();
    let json = transactionApiModels().addTransacionRequest(
      uuid,
      userName,
      date,
      card,
      business,
      amount
    );
    console.log(json);
    client.open(POST, url, false);
    client = setHeaders(client);
    return new Promise(function (resolve, reject) {
      client.onload = resolve;
      client.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log("Transaction edited for user: " + userName);
          resolve(JSON.parse(json));
        } else {
          reject(
            alert(
              "Failed to edit transactions for user: " +
                userName +
                " please try again!"
            )
          );
        }
      };
      client.send(json);
    });
  }

  /**
   * Send a delete request to API gateway to delete a transaction
   * @param {String} uuid unique id of the transaction
   */
  function deleteTransaction(uuid) {
    let userName = cache.user;
    console.log("Deleting transaction for user: " + userName);
    let url = transactionsByUserURI(userName);
    let client = new XMLHttpRequest();
    let json = transactionApiModels().deleteTransactionRequest(uuid);
    client.open(DELETE, url, false);
    client = setHeaders(client);
    return new Promise(function (resolve, reject) {
      client.onload = resolve;
      client.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log("Deleted transaction " + uuid + " for user: " + userName);
          resolve(this);
        } else {
          reject(
            alert(
              "Failed to delete transaction for user: " +
                userName +
                " please try again!"
            )
          );
        }
      };
      client.send(json);
    });
  }

  return {
    addUserTransaction: addUserTransaction,
    getUsersTransactions: getUsersTransactions,
    deleteTransaction: deleteTransaction,
    editUserTransaction: editUserTransaction,
  };
};

export { cardsApi, transactionsApi };
