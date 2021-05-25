export { generateUUID, CheckBoxElement, parseCards };

// helper class to set select checkbox to selected and not selected
class CheckBoxElement {
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

function generateUUID() {
  let uuid = "xxxx-xxxx-xxx-xxxx".replace(/[x]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
  return uuid;
}

// take in request response and store card names in local cache
function parseCards(json) {
  let currentCards = [];
  if (json) {
    let js = $.parseJSON(json);
    // itterate over the cards, i is the index, cards is the JS proto object
    $.each(js, function (i, cards) {
      // itterate over each card
      $.each(cards, function (i, card) {
        currentCards.push(card.cardName);
      });
    });
  }
  return currentCards;
}
