import { CheckBoxElement } from "./util.js";

/**
 * All API's for the transaction table
 */
export var transactionTable = function () {
  var table = null;
  function init() {
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
  }
  /**
   * Add a transaction as a row to the datatable
   * @param {JSON} transaction
   */
  function addTransaction(transaction) {
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
  /**
   * Remove all rows with matching id in the list of ids
   * @param {List} ids unique id of select element that points to a row of the table to remove
   */
  function removeRows(ids) {
    for (var i = 0; i < ids.length; i++) {
      // get the selectors parent td element
      let node = $("#" + ids[i]).parent();
      table.rows(node).remove();
    }
    table.draw();
  }
  /**
   * Return the rows count for the table
   */
  function getRowCount() {
    return table.rows().length;
  }
  init();
  return {
    addTransaction: addTransaction,
    removeRows: removeRows,
    rowCount: getRowCount,
  };
};
