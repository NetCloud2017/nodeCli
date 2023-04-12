#!/usr/bin/env node

const { program } = require("commander");

program.name("ccli").description("cli name").version("0.1.0");

program.option("--first").option("-s, --separator <char>");

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
// ccli aaa/bbb/ccc --first -s '/' (错误) : 还是用 | 号 吧 这个 / 号在win 系统 会别解析到git安装的根目录；
//  ccli -s '|' --first "aaa|bbb|ccc" (正确)
console.log(program.args[0].split(options.separator, limit), program.args); // splite 新用法。
console.log(options, "command options");
