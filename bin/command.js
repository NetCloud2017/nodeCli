// command 库练习

const command = require("commander");

const program = new command();

program.name("ccli").description("cli name").version("0.1.0");

program
  .command("create")
  .description("create  ob")
  .option("-l", "option  description")
  .action((argv, options) => {
    console.log(argv, options, "action");
  });
