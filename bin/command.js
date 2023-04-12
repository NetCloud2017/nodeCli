#!/usr/bin/env node

const { program } = require("commander");

program.name("ccli").description("cli name").version("0.1.0");

program
  .option("--first") // 一般选项；值都是 字符串或者布尔值
  .option("-a, --age") // 简写和全写。
  .option("-s, --separator <char>") // 必填产生 <char>
  .option("-n, --name [char]"); // 选填参数 [char]
program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
// ccli aaa/bbb/ccc --first -s '/' (错误) : 还是用 | 号 吧 这个 / 号在win 系统 会别解析到git安装的根目录；
//  ccli -s '|' --first "aaa|bbb|ccc" (正确)
console.log(program.args[0].split(options.separator, limit), program.args); // splite 新用法。
console.log(options, "command options");
