import * as cache from "./cache.js";
// make sure the cardname is valid
export function validateCardName(cardName) {
  if (cardName) {
    return true;
  } else {
    return false;
  }
}
