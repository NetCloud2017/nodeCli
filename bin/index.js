#!/usr/bin/env node

// 用于指明 用node 来解析这个应用程序。
console.log("hello worlb  cli");

//  npm link  让这个包临时注册到这个电脑的盘里， 然后可以在终端里运行 bin 里的命令了 如 当前的 cus-cli ， node 就会执行这个index.js 文件

const { program } = require("commander");
const inquirer = require("inquirer");
const { devRollup } = require("./rollup");
program
  .version("0.1.0")
  .description("this is a cli  for teaching")
  .command("pack [entry]") // 用[] 中括号表示可选， 用 <> 表示必选。
  .description("this is  a  pack tools for react")
  .option("-d, --dev", "开发模式")
  .option("-p, --prod", "生成模式1")
  .action((entry, type) => {
    console.log(
      `this is the entry : ${entry} and  type is  ${JSON.stringify(type)}}`
    );

    let { dev, prod } = type;
    if (!(dev || prod)) {
      const promptList = [
        {
          type: "list",
          message: "运行(dev)还是打包(prod)?",
          name: "packEnv",
          choices: ["dev", "prod"],
        },
      ];
      inquirer.prompt(promptList).then((res) => {
        if (res.packEnv === "dev") {
          console.log("我要运行");
          devRollup(entry);
        } else {
          console.log("我要打包");
        }
      });
    } else {
      dev && console.log("我要运行");
      prod && console.log(" 我要打包");
    }
  });

program
  .version("0.1.0")
  .description("this is a cli  for teaching")
  .command("create") // 用[] 中括号表示可选， 用 <> 表示必选。
  .description("this is template generator");

program.parse(process.argv);
