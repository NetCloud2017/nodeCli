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
const { Command, Option } = require("commander");
const programInstance = new Command();

// commander 自动给每一个命令生成对应的文档，还有命令输入错误时的，模糊匹配提示。
programInstance.name("ccli").description("cli name").version("0.1.0");
programInstance
  .command("split") // 子命令
  .description("split  string to array")
  .argument("<string>", "string  to split") // 子命令的参数
  .option("--first") // 子命令的选项
  .option("-s, --separator <char>", "separator char", "|") // "|" 是 option 默认值
  .action((arg, options, cmd) => {
    console.log(arg, options, "uuus"); // arg 就是 <string>, options 就是对应的 optinos。

    // action 里获取全局对象
    // 1
    let a = programInstance.getOptionValue("a");
    console.log(a, "a");
    // 2
    let globalOptions = programInstance.commands[0].optsWithGlobals();
    console.log(globalOptions);
    // 3
    console.log(cmd.opts());
    console.log(cmd.optsWithGlobals());
  });

// options的四种用法
// 不能只获取全局options 需要带上一个子命令；//  ccli split 111 -a a
programInstance
  .option("-a <char>") // 全局 的option
  .option("-a<char>")
  .option("--age=<char>")
  .option("--age <char>");

// options 连写
//  ccli split 111 -a a -dg

// 注意带参数的option 的连写问题， 一般将带参数的option 放到最后， 否则他会把后面的当成自己的参数。
//  ccli split 111 -dag 把 g 当成自己的参数了。
programInstance
  .option("-d --debug", "debugging")
  .option("-g --global", "global");

programInstance
  .command("create")
  .description("creata  project")
  .argument("<char>", "create arg")
  .requiredOption("-t, --ttt <char>", "template") // 必须的 options，注意，加了默认值就没效了。不能加默认值
  .option("-a, --add", "add number")

  .option("-l, --letters <char...>", "specify letters")
  // 注意与命令的 arguments 问题 用 -- 隔开参数例如:
  // ccli create  -d -t u77 -l a b c 777 报错 没有 arguments
  // ccli create  -d -t u77 -l a b c -- 777

  .action((arg, options) => {
    console.log(arg, options, "create command");
  });

programInstance
  .command("test")
  .addOption(new Option("-s, --select", "select, something").hideHelp()) // 隐藏 选项
  .addOption(
    new Option("-t, --timeout <delay>", "timeout seconds").default(
      60,
      "one minute"
    )
  ) // 默认值 和默认值提示
  .addOption(
    new Option("-c --choice <choice>", "your choice").choices([
      "small",
      "medium",
      "large",
    ])
  ) // 选项功能
  .addOption(new Option("-p --port <number>", "port number").env("PORT")) // env 通过环境变量获取值当作 port 的值。
  //  PORT=80 ccli test -t 11 -s 需要写到前面。否则无效。
  .action((options, cmd) => {
    console.log(options, cmd.optsWithGlobals());
  });
programInstance.parse();

const globalOptions = programInstance.optsWithGlobals(); // 获取全局 option
console.log(globalOptions, "uuu");
