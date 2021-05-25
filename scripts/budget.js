import { cardsApi, transactionsApi } from "/scripts/api-gateway.js";
import { cache } from "/scripts/cache.js";
import { transactionTable } from "/scripts/transaction-table.js";
import { CheckBoxElement, parseCards } from "/scripts/util.js";
import { checkSession } from "/scripts/cognito.js";

var table = transactionTable();

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
              setTransactionsTable();
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

/*
 *DOM SPECIFIC ACTIONS
 */
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

  $(document).ready(function () {
    var table = $("#transactionTable").DataTable();

    $("#transactionTable tbody").on("click", "tr", function () {
      var data = table.row(this).data();
      alert("You clicked on " + data[0] + "'s row");
    });
  });
};
