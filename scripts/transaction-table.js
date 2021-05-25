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
            '<button class="btn btn-sm btn-secondary dropdown-toggle" style="margin-bottom:2px" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            "Actions" +
            "</button>" +
            '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
            '<a class="dropdown-item" id="removeTransactionAction" href="#">Remove</a>' +
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
   * Remove row that matches id of select element
   * @param {String} id unique id of select element that points to a row of the table to remove
   */
  function removeRow(id) {
    let node = $("#" + id).parent();
    if (node) {
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

  function getRows() {
    return table.rows();
  }

  init();
  return {
    addTransaction: addTransaction,
    removeRow: removeRow,
    rowCount: getRowCount,
    getRows: getRows,
  };
};
