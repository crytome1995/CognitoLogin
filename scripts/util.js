import * as cache from "./cache.js";
// make sure the cardname is valid
export function validateCardName(cardName) {
  if (cardName) {
    return true;
  } else {
    return false;
  }
}

// helper class to set select checkbox to selected and not selected
export class CheckBoxElement {
  constructor() {}

  get checked() {
    return '<input type="checkbox" checked="true" id="transactionCheckBox">';
  }

  get unchecked() {
    return '<input type="checkbox" id="transactionCheckBox">';
  }
}
