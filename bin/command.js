// command 库练习

const { program } = require("commander");

program.name("ccli").description("cli name").version("0.1.0");

program.command("--frist").option("-s, --seperator <char>");

program.parse();
const options = program.opts();
console.log(options, "command options");
