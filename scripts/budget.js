import { cardsApi, transactionsApi } from "/scripts/api-gateway.js";
import { cache } from "/scripts/cache.js";
import { transactionTable } from "/scripts/transaction-table.js";
import { CheckBoxElement } from "/scripts/util.js";

loadBudgetSession();
var table = transactionTable();
async function loadBudgetSession() {
  loadCards().then(() => {
    // set select options
    setSelectCards();
    setTransactionsTable();
  });
}

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
  $('select[name="cardSelectTransaction"]').html(optionsAsString);
}

// construct the transaction table
function setTransactionsTable() {
  let transactions;
  transactionsApi()
    .getUsersTransactions()
    .then(
      function (e) {
        // store the transactions
        parseTransaction(e.responseText);
        transactions = cache.transactions;
        // construct the table
        for (var i = 0; i < transactions.length; i++) {
          let transaction = transactions[i];
          table.addTransaction(transaction);
        }
      },
      function (e) {
        console.log(e.responseText);
      }
    );
  // remove row action
  $("#removeTransactionAction").click(function (event) {
    event.preventDefault();
    // get all colums selected
    let rows = table.getRows();
    //rows data is how we can access the individual row
    for (var i = 0; i < rows.data().length; i++) {
      let selectColumn = rows.rows(i).data()[0][0];
      let id = $(selectColumn).attr("id");
      if ($("input#" + id + ":checked").length > 0) {
        transactionsApi()
          .deleteTransaction(id)
          .then(
            function (e) {
              table.removeRow(id);
            },
            function (e) {}
          );
      }
    }
  });
}

// take in request response and store card names in local cache
function parseCards(json) {
  if (json) {
    let currentCards = [];
    let js = $.parseJSON(json);
    // itterate over the cards, i is the index, cards is the JS proto object
    $.each(js, function (i, cards) {
      // itterate over each card
      $.each(cards, function (i, card) {
        currentCards.push(card.cardName);
      });
    });
    if (currentCards) {
      cache.cards = currentCards;
      console.log("Stored cards to cache");
    }
  }
}

// take in a transaction response and add list to cache
function parseTransaction(json) {
  if (json) {
    let currentTransactions = [];
    let js = $.parseJSON(json);
    // itterate over the cards, i is the index, cards is the JS proto object
    $.each(js, function (i, transactions) {
      // itterate over each card
      $.each(transactions, function (i, transaction) {
        currentTransactions.push(transaction);
      });
    });
    if (currentTransactions) {
      cache.transactions = currentTransactions;
      console.log("Stored transactions to cache");
    }
  }
}

// call get cards GW API and store cards in cache
async function loadCards() {
  cardsApi()
    .queryUserCards()
    .then(
      function (e) {
        // parse json to javascript object
        parseCards(e.responseText);
      },
      function (e) {
        location.reload();
      }
    );
}

/*
 *DOM SPECIFIC ACTIONS
 */
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

document.getElementById("addTransactionButton").onclick = function (event) {
  event.preventDefault();
  let business = document.getElementById("business").value;
  let cardSelectTransaction = document.getElementById("cardSelectTransaction")
    .value;
  let amount = parseFloat(document.getElementById("amount").value);
  let date = document.getElementById("dateSelectTransaction").value;
  if (cardName) {
    transactionsApi()
      .addUserTransaction(cardSelectTransaction, business, amount, date)
      .then(
        function (json) {
          table.addTransaction(json);
          $("#modalAddTransactionForm").modal("toggle");
        },
        function (e) {
          console.log(e.responseText);
        }
      );
  }
};
//select all rows action flip between all checked and all not checked
document.getElementById("selectAllCheckbox").onclick = function () {
  var rows = document.getElementById("transactionTable").rows;
  for (var i = 1; i < rows.length; i++) {
    var checkBox = new CheckBoxElement();
    var row = rows[i].cells;
    var boxHtml = row[0].innerHTML;
    var uuid = checkBox.parseUuid(boxHtml);
    if (boxHtml == checkBox.checked(uuid)) {
      boxHtml = checkBox.unchecked(uuid);
    } else {
      boxHtml = checkBox.checked(uuid);
    }
    row[0].innerHTML = boxHtml;
  }
};
