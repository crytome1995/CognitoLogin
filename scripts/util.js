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

  checked(uuid) {
    return '<input type="checkbox" checked="true" id="' + uuid + '">';
  }

  unchecked(uuid) {
    return '<input type="checkbox" id="' + uuid + '">';
  }

  parseUuid(checkboxHTML) {
    return $(checkboxHTML).attr("id");
  }
}
