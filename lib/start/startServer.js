const { resolve } = require("path");
const chokidar = require("chokidar");
const { program } = require("commander");
const cp = require("child_process");

let child;
function runWatcher() {
  // 启动配置监听服务

  const configPath = resolve("./config.json");
  const watcher = chokidar
    .watch(resolve(process.cwd(), "lib/start"))
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
function runServer() {
  // 启动webpack 服务
  // 启动进程的方式
  const scriptPath = resolve(__dirname, "../devService.js");
  child = cp.fork(scriptPath, ["--prot 8080"]);
  child.on("exit", function (code) {
    if (code) {
      process.exit(code);
    }
  });
}
module.exports = function (arg, optinos, cmd) {
  runServer();
  runWatcher();
};
