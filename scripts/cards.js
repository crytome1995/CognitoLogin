import { cardsApi } from "/scripts/api-gateway.js";
import { cache } from "/scripts/cache.js";
import { checkSession } from "/scripts/cognito.js";

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
