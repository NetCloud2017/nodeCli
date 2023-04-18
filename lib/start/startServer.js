const { resolve } = require("path");
const chokidar = require("chokidar");
const { program } = require("commander");
const cp = require("child_process");

const { getConfigFile } = require("../utils");
const log = require("../utils/log");

let child;
function runWatcher() {
   // 启动配置监听服务
   const configPath = getConfigFile();

   chokidar
      .watch(configPath)
      .on("change", onChange)
      .on("error", (error) => {
         console.error("file watch error", error);
         process.exit(1);
      });
}
function onChange() {
   console.log("change");
   child.kill();
   runServer();
}
function runServer(args = {}) {
   // 启动webpack 服务
   // 启动进程的方式
   const { config = "", customWebpackPath = "", stopBuild = false } = args;

   const scriptPath = resolve(__dirname, "./devService.js");
   child = cp.fork(scriptPath, [
      "--prot 8080",
      "--config " + config,
      "--customWebpackPath " + customWebpackPath,
      "-- stop-build" + stopBuild,
   ]);
   // 服务进程退出的时候， 当前进程也退出
   child.on("exit", function (code) {
      if (code) {
         process.exit(code);
      }
   });
}
module.exports = function (opts, cmd) {
   log.verbose("startServer", opts);
   runServer(opts);
   runWatcher();
};
