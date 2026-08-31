const { test } = require("node:test");
const assert = require("node:assert");

test("health check passes", () => {
  assert.equal(1 + 1, 2);
});
