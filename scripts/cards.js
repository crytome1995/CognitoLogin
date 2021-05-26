import { cardsApi } from "/scripts/api-gateway.js";
import { cache } from "/scripts/cache.js";
import { checkSession } from "/scripts/cognito.js";
import { parseCards } from "/scripts/util.js";
// IIFE to check cognito session and setup webpage
(async function () {
  checkSession().then(
    function (e) {
      cardsApi()
        .queryUserCards()
        .then(
          function (e) {
            // parse json to javascript object
            // list of cards
            let cards = parseCards(e.responseText);
            if (cards.length > 0) {
              cache.cards = cards;
              setSelectCards();
            }
          },
          function (e) {}
        );
    },
    function (e) {
      console.log(e);
    }
  );
})();

// set the select options based on cards in cache
function setSelectCards() {
  $('select[name="cardSelect"]').empty();
  var optionsAsString = "";
  var cards = cache.cards;
  for (var i = 0; i < cards.length; i++) {
    optionsAsString +=
      "<option value='" + cards[i] + "'>" + cards[i] + "</option>";
  }
  $('select[name="cardSelect"]').html(optionsAsString);
}
// ADD CARD button action
document.getElementById("addCardButton").onclick = function (event) {
  event.preventDefault();
  let cardName = document.getElementById("cardName").value;

  if (cardName) {
    if (!cache.cardExists(cardName)) {
      cardName = cardName.trim();
      cardsApi()
        .addUserCard(cardName)
        .then(
          function (e) {
            cache.addCard(cardName);
            setSelectCards();
            $("#modalAddCardForm").modal("toggle");
          },
          function (e) {}
        );
    } else {
      alert("Card with name " + cardName + " already exists!");
    }
  }
};

//only close the window if a valid cardName is given
document.getElementById("removeCardButton").onclick = function (event) {
  event.preventDefault();
  let confirmation = false;
  let cardName = document.getElementById("cardSelect").value;
  if (cardName) {
    confirmation = confirm("Are you sure?");
    if (confirmation) {
      let cardName = document.getElementById("cardSelect").value;
      cardsApi()
        .removeCard(cardName)
        .then(
          function (e) {
            cache.removeCard(cardName);
            setSelectCards();
            $("#modalRemoveCardForm").modal("toggle");
          },
          function (e) {}
        );
    }
  }
};
