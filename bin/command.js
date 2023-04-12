#!/usr/bin/env node

// const { program, Command } = require("commander");
// program 也是Command 的实例。

// ccli 是主命令
// program.name("ccli").description("cli name").version("0.1.0");

// program
//   .option("--first") // 一般选项；值都是 字符串或者布尔值
//   .option("-a, --age") // 简写和全写
//   .option("-s, --separator <char>") // 必填产生 <char>
//   .option("-n, --name [char]"); // 选填参数 [char]
// program.parse();

// const options = program.opts();
// const limit = options.first ? 1 : undefined;
// ccli aaa/bbb/ccc --first -s '/' (错误) : 还是用 | 号 吧 这个 / 号在win 系统 会别解析到git安装的根目录；
//  ccli -s '|' --first "aaa|bbb|ccc" (正确)
// console.log(program.args[0].split(options.separator, limit), program.args); // splite 新用法。
// console.log(options, "command options");

// 创建子命令
// version 2
const { Command } = require("commander");
const programInstance = new Command();

// commander 自动给每一个命令生成对应的文档，还有命令输入错误时的，模糊匹配提示。
programInstance.name("ccli").description("cli name").version("0.1.0");
programInstance
  .command("split") // 子命令
  .description("split  string to array")
  .argument("<string>", "string  to split") // 子命令的参数
  .option("--first") // 子命令的选项
  .option("-s, --separator <char>", "separator char", "|") // "|" 是 option 默认值
  .action((arg, options) => {
    console.log(arg, options, "uuus"); // arg 就是 <string>, options 就是对应的 optinos。
  });

programInstance.parse();
