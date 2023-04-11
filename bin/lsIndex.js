#!/usr/bin/env node

const fs = require("fs");
const cp = require("child_process");

function parse() {
  let isAll = false; //  -a
  let isList = false; // -l
  const args = process.argv.slice(2);
  args.forEach((arg) => {
    if (arg.indexOf("a") >= 0) {
      isAll = true;
    }
    if (arg.indexOf("l") >= 0) {
      isList = t;
    }
  });
  return {
    isAll,
    args,
    isList,
  };
}
function outh(mode) {
  // 文件权限
  let outhString = "";
  // user 权限
  const userCanRead = mode & fs.constants.S_IRUSR;
  const userCanWrite = mode & fs.constants.S_IWUSR;
  const userCanExecute = mode & fs.constants.S_IXUSR; // 是否可执行

  userCanRead ? (outhString += "r") : (outhString += "-");
  userCanWrite ? (outhString += "w") : (outhString += "_");
  userCanExecute ? (outhString += "x") : (outhString += "-");
  // 用户组 权限
  const groupCanRead = mode & fs.constants.S_IRUSR;
  const groupCanWrite = mode & fs.constants.S_IWUSR;
  const groupCanExecute = mode & fs.constants.S_IXUSR; // 是否可执行

  groupCanRead ? (outhString += "r") : (outhString += "-");
  groupCanWrite ? (outhString += "w") : (outhString += "_");
  groupCanExecute ? (outhString += "x") : (outhString += "-");

  // 其他用户权限
  const otherUserCanRead = mode & fs.constants.S_IRUSR;
  const otherUserCanWrite = mode & fs.constants.S_IWUSR;
  const otherUserCanExecute = mode & fs.constants.S_IXUSR; // 是否可执行

  otherUserCanRead ? (outhString += "r") : (outhString += "-");
  otherUserCanWrite ? (outhString += "w") : (outhString += "_");
  otherUserCanExecute ? (outhString += "x") : (outhString += "-");

  return outhString;
}
function getFileType(mode) {
  const isDirectory = mode & fs.constants.S_IFDIR;
  const isFile = mode & fs.constants.S_IFREG;
  const isLink = mode & fs.constants.S_IFLNK;

  if (isDirectory) {
    return "d";
  } else if (isFile) {
    return "-";
  } else {
    return "l";
  }
}

function getFileCreater(stat) {
  const { uid, gid } = stat;
  console.log(stat, "uus");
  /** $
   * @有问题获取不到uid和gid
   * */
  //   let userName = cp.execSync("id -un " + uid); // 通过 id 这个库获取用户名， 返回来的是Buffer
  //   userName = userName.toString().trim();
  //   const groupIdsStr = cp
  //     .execSync("id -G " + uid)
  //     .toString()
  //     .trim();
  //   const groupIds = groupIdsStr.split(" ");
  //   const groupIdsNameStr = cp
  //     .execSync("id -Gn " + uid)
  //     .toString()
  //     .trim();
  //   const groupIdsNames = groupIdsNameStr.split(" ");
  //   const groupIndex = groupIds.findIndex((id) => +id === +gid);

  //   const groupName = groupIdsNames[groupIndex];
  //   return userName + "  " + groupName;
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
  console.log(files);
  files.forEach((file, index) => {
    const stat = fs.statSync(file);
    const mode = stat.mode;
    const fileType = getFileType(mode);
    const outhString = outh(mode);
    const fileCreater = getFileCreater(stat);

    // stat.isDirectory() // stat 也可以用于判断文件是不文件夹
    if (index === files.length - 1) {
      output += fileType + outhString + "\t" + fileCreater + "\t" + file;
    } else {
      output += fileType + outhString + "\t" + fileCreater + "\t" + file + "\n";
    }
  });
}

console.log(output);
