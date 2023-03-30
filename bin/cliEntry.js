#!/usr/bin/env node
// 慕课脚手架

const { program } = require("commander");

const pkg = require("../package.json");

const checkVersion = require("../lib/checkVersion");
const startServer = require("../lib/startServer");
const build = require("../lib/build");

const minimum_version = "14.21.3";

(async () => {
  try {
    if (!checkVersion(minimum_version)) {
      throw new Error(
        "Please upgrade your node  version to  v" + minimum_version
      );
    }
    program.version(pkg.version);
    program
      .command("start")
      .description("start server by CLI  tool")
      .allowUnknownOption()
      .action(startServer);

    program
      .command("build")
      .description("build project by ClI tool")
      .allowUnknownOption() // 允许写入未知选项
      .action(build);

    // 解析命令
    program.parse(process.argv);
  } catch (e) {
    console.log(e.message);
  }
})();
