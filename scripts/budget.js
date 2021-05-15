import {
  addCard,
  getCards,
  deleteCard,
  getTransactionsByUser,
  addUserTransaction,
} from "/scripts/api-gateway.js";
import {
  addCardNames,
  getCardNames,
  addCardName,
  removeCardName,
  cardExists,
  addTransactions,
  getTransactions,
} from "/scripts/cache.js";
import { validateCardName, CheckBoxElement } from "/scripts/util.js";
import { checkLoginSession } from "/scripts/cognito.js";

/**
 * JQUERY CODE HERE
 */

/**
 * JQUERY CODE END
 */
var table;

onload = loadBudgetSession();

function loadBudgetSession() {
  checkLoginSession().then(
    function (e) {
      loadCards().then(() => {
        // set select options
        setSelectCards();
        setTransactionsTable();
      });
    },
    function (e) {
      console.log(e);
      alert("Session expired... returning to login");
      window.location.href = "/index.html";
    }
  );
}

// set the select options based on cards in cache
function setSelectCards() {
  $('select[name="cardSelect"]').empty();
  var optionsAsString = "";
  var cards = getCardNames();
  console.log(cards);
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
  // initialize the datatable object
  table = $("#transactionTable").DataTable({
    columnDefs: [{ orderable: false, targets: 0 }],
    dom: 'l<"toolbar">frtip',
    order: [[1, "asc"]],
    initComplete: function () {
      $("div.toolbar").html(
        '<div class="dropdown" id="actionDropdown">' +
          '<button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
          "Actions" +
          "</button>" +
          '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
          '<a class="dropdown-item" id="removeTransactionAction" href="#">Remove</a>' +
          '<a class="dropdown-item" href="#">Another action</a>' +
          '<a class="dropdown-item" href="#">Something else here</a>' +
          "</div>" +
          "</div>"
      );
    },
  });
  // add options button
  // call get transactions by user API
  getTransactionsByUser().then(
    function (e) {
      // store the transactions
      parseTransaction(e.target.responseText);
      transactions = getTransactions();
      // construct the table
      for (var i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];
        addTransactionRow(transaction);
      }
    },
    function (e) {
      console.log(e.target.responseText);
    }
  );
  // remove row action
  $("#removeTransactionAction").click(function (event) {
    event.preventDefault();
    // get all colums selected
    let selectedRows = [];
    let rowIds = [];
    //rows data is how we can access the individual row
    for (var i = 0; i < table.rows().data().length; i++) {
      let selectColumn = table.rows(i).data()[0][0];
      let id = $(selectColumn).attr("id");
      if ($("input#" + id + ":checked").length > 0) {
        rowIds.push(id);
        selectedRows.push(i);
      }
    }
    if (rowIds.length > 0) {
      removeSelectedRows(rowIds);
    }
  });
}

// table functions start ----
// add a row to the table
function addTransactionRow(transaction) {
  table.row
    .add([
      new CheckBoxElement().unchecked(transaction.uuid),
      transaction.date,
      transaction.card,
      transaction.business,
      transaction.amount,
    ])
    .draw(false);
}

// remove a row from the table
// row id to remove from table
function removeSelectedRows(ids) {
  for (var i = 0; i < ids.length; i++) {
    // get the selectors parent td element
    let node = $("#" + ids[i]).parent();
    table.rows(node).remove();
  }
  table.draw();
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
      addCardNames(currentCards);
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
      addTransactions(currentTransactions);
      console.log("Stored transactions to cache");
    }
  }
}

// call get cards GW API and store cards in cache
async function loadCards() {
  getCards().then(
    function (e) {
      // parse json to javascript object
      parseCards(e.target.responseText);
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
      deleteCard(cardName).then(
        function (e) {
          removeCardName(cardName);
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
    if (!cardExists(cardName)) {
      cardName = cardName.trim();
      addCard(cardName).then(
        function (e) {
          addCardName(cardName);
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

document.getElementById("addCardButton").onclick = function (event) {
  event.preventDefault();
  let cardName = document.getElementById("cardName").value;

  if (cardName) {
    if (!cardExists(cardName)) {
      cardName = cardName.trim();
      addCard(cardName).then(
        function (e) {
          addCardName(cardName);
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
    if (!cardExists(cardName)) {
      addUserTransaction(cardSelectTransaction, business, amount, date).then(
        function (e) {
          addTransactionRow(e);
          $("#modalAddTransactionForm").modal("toggle");
        },
        function (e) {
          console.log(e.target.responseText);
        }
      );
    }
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
