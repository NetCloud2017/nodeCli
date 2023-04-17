#!/usr/bin/env node

// 慕课学习脚手架

checkDebug(); // 要前确定 npmlog level

const { program } = require("commander");

const pkgJson = require("../package.json");
const checkNode = require("../lib/checkNode");
const MIN_NODE_VERSION = "12.0.0";
const startServer = require("../lib/start/startServer");
const build = require("../lib/build/index.js");

function checkDebug() {
   if (
      process.argv.indexOf("--debug") >= 0 ||
      process.argv.indexOf("-d") >= 0
   ) {
      process.env.LOG_LEVEL = "verbose"; // 修改 npmlog 打印 level 在调试时才开启 verbose 打印。
   } else {
      process.env.LOG_LEVEL = "info";
   }
}

(async () => {
   try {
      if (!checkNode(MIN_NODE_VERSION)) {
         // 提前检测node 版本

         throw new Error(
            `you node version is too low to support this package, Please upgrade to  node  version ${MIN_NODE_VERSION} above.`
         );
      }

      program
         .command("start")
         .description("start  ccli server")
         .option("-c, --config <path>", "cli config file path")
         .option("--stop-build", "stop setup server")
         .option(
            "--custom-webpack-path <customWebpackPath>",
            "custom webpack path"
         )
         .allowUnknownOption()
         .action(startServer);

      program
         .command("build")
         .description("build you project")
         .option("-c, --config <path>", "cli config file path")
         .option(
            "--custom-webpack-path <customWebpackPath>",
            "custom webpack path"
         )
         .allowUnknownOption()
         .action(build);

      program.option("-d, --debug", "开启调试模式");

      program.version(pkgJson.version);
      program.parse(process.argv);
   } catch (error) {
      console.log(error, "eee");
   }
})();
