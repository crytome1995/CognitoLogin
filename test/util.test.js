import { CheckBoxElement } from "../scripts/util";
var assert = require("assert");
/**
 * INITIALIZE JQUERRY
 */
require("jsdom-global")();
global.window = window;
global.$ = require("jquery");
global.jQuery = $;

describe("get id 123 from check box checked html", function () {
  it("parseId", function () {
    let id = 123;
    let cb = new CheckBoxElement();
    let cbHtml = cb.checked(id);

    assert.equal(cb.parseUuid(cbHtml), id);
  });
});

describe("get id 123 from check box unchecked html", function () {
  it("parseId", function () {
    let id = 123;
    let cb = new CheckBoxElement();
    let cbHtml = cb.unchecked(id);

    assert.equal(cb.parseUuid(cbHtml), id);
  });
});
