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
  // edit transaction form
  $('select[name="cardSelectEditTransaction"]').html(optionsAsString);
  // transaction form
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
};

// allow editting a transaction if and only if one is selected
$("#editTransaction").click(function (event) {
  // get all colums selected
  let rows = table.getRows();
  let selectedRowCount = 0;
  let rowSelected;
  //rows data is how we can access the individual row
  for (var i = 0; i < rows.data().length; i++) {
    let selectColumn = rows.rows(i).data()[0][0];
    let id = $(selectColumn).attr("id");
    if ($("input#" + id + ":checked").length > 0) {
      selectedRowCount += 1;
      // Only fire event if the one row is selected
      if (selectedRowCount > 1) {
        return;
      } else {
        rowSelected = i;
      }
    }
  }
  // Do nothing as this is the row with headers
  /**
   * 0: select box
   * 1: date
   * 2: card name
   * 3: business
   * 4: amount
   */
  if (rowSelected >= 0) {
    console.log(rowSelected);
    let dataList = rows.rows(rowSelected).data()[0];
    // set fields
    let selectColumn = dataList[0];
    let id = $(selectColumn).attr("id");
    console.log(id);
    $("#uuidTransaction").text(id);
    $("#businessEdit").val(dataList[3]);
    $("#amountEdit").val(dataList[4]);
    $("#cardSelectEditTransaction").val(dataList[2]);
    $("#dateSelectEditTransaction").val(dataList[1]);
    $("#modalEditTransactionForm").modal("show");
  }
});

// function for editing a transaction
document.getElementById("editTransactionButton").onclick = function (event) {
  event.preventDefault();
  let business = document.getElementById("businessEdit").value;
  let cardSelectTransaction = document.getElementById(
    "cardSelectEditTransaction"
  ).value;
  let amount = parseFloat(document.getElementById("amountEdit").value);
  let date = document.getElementById("dateSelectEditTransaction").value;
  let uuid = $("#uuidTransaction").text();
  console.log(uuid);
  if (cardName) {
    transactionsApi()
      .editUserTransaction(cardSelectTransaction, business, amount, date, uuid)
      .then(
        function (json) {
          table.replaceRow(json);
          $("#modalEditTransactionForm").modal("toggle");
        },
        function (e) {
          console.log(e.responseText);
        }
      );
  }
};
