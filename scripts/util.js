export { generateUUID, CheckBoxElement, sleep };

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
