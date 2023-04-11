var assert = require("assert");
const { parse, getFileType } = require("../bin/lsIndex");

describe("ccli", function () {
  describe("parseArgv", function () {
    it("test args", function () {
      const { isAll, isList, args } = parse();
      assert.equal(isAll, false);
      assert.equal(isList, false);
      assert.equal(args.length, 1);
      assert.equal(args[0], "test/test.js");
    });
  });

  describe("getfileType", function () {
    it("is derectory", function () {
      const mode = 16384;
      let fileType = getFileType(mode);

      assert.equal(fileType, "d");
    });
    it("is link", function () {
      const dir = 40960;
      let fileType = getFileType(dir);

      assert.equal(fileType, "l");
    });
    it("is file", function () {
      const dir = 32768;
      let fileType = getFileType(dir);

      assert.equal(fileType, "-");
    });
  });
});
