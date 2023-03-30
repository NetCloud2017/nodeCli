const chokidar = require("chokidar");
const path = require("path");

const { program } = require("commander");

const cp = require("child_process");

let child;

function runServer() {
  // 子进程启动
  const scriptPath = path.resolve(__dirname, "./devService.js");
  child = cp.fork(scriptPath, ["--port 8080"]); // 执行这个脚本， 并创建子进程。
  child.on("exit", (code) => {
    if (code) {
      process.exit(code); //退出子进程
    }
  });
}

function onChange() {
  child.kill();
  runServer();
}
function runWatcher() {
  const configPath = path.resolve(__dirname, "./config.json");
  chokidar
    .watch(configPath) // 监听config.json 这个文件
    .on("change", onChange)
    .on("error", (err) => {
      console.log("file watch error", error);
      process.exit(1); //
    });
}

module.exports = function (arg, opts, cmd) {
  // 创建子进程
  runServer();

  // 监听文件
  runWatcher();
};
