var assert = require("assert");
const { parse } = require("../bin/lsIndex");

describe("ccli", function () {
  describe("parseArgv", function () {
    it("test args", function () {
      const { isAll, isList, args } = parse();
      assert.equal(isAll, false);
      assert.equal(isList, false);
      assert.equal(args.length, 3);
    });
  });
});
