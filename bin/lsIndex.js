#!/usr/bin/env node

const fs = require("fs");
function parse() {
  let isAll = false; //  -a
  let isList = false; // -l
  const args = process.argv.slice(2);
  args.forEach((arg) => {
    if (arg.indexOf("a") >= 0) {
      isAll = true;
    }
    if (arg.indexOf("l") >= 0) {
      isList = true;
    }
  });
  return {
    isAll,
    args,
    isList,
  };
}
const { isAll, isList, args } = parse();
const dir = process.cwd();
let files = fs.readdirSync(dir);
let output = "";
if (!isAll) {
  files = files.filter((file) => file.indexOf(".") !== 0);
}
if (!isList) {
  // 去除 .开头的文件
  files.forEach((file) => (output += file + "       "));
} else {
  files.forEach((file, index) => {
    if (index === files.length - 1) {
      output += file;
    } else {
      output += file + "\n";
    }
  });
}

console.log(output);
