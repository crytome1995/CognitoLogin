export { cardApiModels, transactionApiModels };
var USER_KEY = "user";

var cardApiModels = function () {
  var CARD_NAME_KEY = "cardName";
  /**
   * Construct and return a card request json
   * @param {String} userName
   * @param {String} cardName
   */
  function addCardRequest(userName, cardName) {
    let json = {
      [USER_KEY]: userName,
      [CARD_NAME_KEY]: cardName,
    };
    return JSON.stringify(json);
  }

  return {
    addCardRequest: addCardRequest,
  };
};

var transactionApiModels = function () {
  var UUID_KEY = "uuid";
  var DATE_KEY = "date";
  var CARD_KEY = "card";
  var BUSINESS_KEY = "business";
  var AMOUNT_KEY = "amount";

  /**
   * Construct and return an add transaction request json
   * @param {String} uuid
   * @param {String} username
   * @param {String} date
   * @param {String} card
   * @param {String} business
   * @param {Number} amount
   */
  function addTransacionRequest(uuid, username, date, card, business, amount) {
    let json = {
      [USER_KEY]: username,
      [UUID_KEY]: uuid,
      [DATE_KEY]: date,
      [CARD_KEY]: card,
      [BUSINESS_KEY]: business,
      [AMOUNT_KEY]: amount,
    };
    return JSON.stringify(json);
  }

  /**
   * Construct and return a delete transaction json
   * @param {String} uuid unique identifier for the transaction
   */
  function deleteTransactionRequest(uuid) {
    let json = {
      [UUID_KEY]: uuid,
    };
    return JSON.stringify(json);
  }
  return {
    addTransacionRequest: addTransacionRequest,
    deleteTransactionRequest: deleteTransactionRequest,
  };
};
