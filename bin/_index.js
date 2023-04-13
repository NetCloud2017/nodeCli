#!/usr/bin/env node

const { program } = require("commander");

const pkgJson = require("../package.json");

const checkNode = require("../lib/checkNode");
const MIN_NODE_VERSION = "12.0.0";
const startServer = require("../lib/startServer");
const build = require("../lib/build/index.js");

(async () => {
  try {
    if (checkNode(MIN_NODE_VERSION)) {
      throw new Error(
        `you node version is too low to support this package, Please upgrade to  node  version ${MIN_NODE_VERSION} above.`
      );
    }
    program
      .command("start")
      .description("start  ccli server")
      .allowUnknownOption()
      .action(startServer);
    console.log(23);
    program
      .command("build")
      .description("build you project")
      .allowUnknownOption()
      .action(build);

    program.version(pkgJson.version);
    program.parse(process.argv);
  } catch (error) {}
})();
