const fg = require("fast-glob");

const log = require("./log");
const path = require("path");
const fs = require("fs");
const { resolve } = require("path");
const DEFAULT_CONFIG_FILE = ["ssConfig.(mjs|js)"];

function getConfigFile({ cwd = process.cwd() } = {}) {
   const [configFile] = fg.sync(DEFAULT_CONFIG_FILE, { cwd, absolute: true }); // 直接获取配置文件
   log.verbose("configFile", configFile);
   return configFile;
}

async function loadModule(modulePath) {
   let fnPath;
   // 判断 modulePath 为模块还是路径
   if (modulePath.startsWith("/") || modulePath.startsWith(".")) {
      fnPath = path.isAbsolute(modulePath)
         ? modulePath
         : path.resolve(modulePath);
   } else {
      fnPath = modulePath;
   }

   fnPath = require.resolve(fnPath, {
      paths: [path.resolve(process.cwd(), "node_modules")],
   });
   //判读是 esmodule 还是 commonjs 用不同的方式导入 文件
   if (fnPath && fs.existsSync(fnPath)) {
      let result;
      const isMjs = fnPath.endsWith("mjs");
      if (isMjs) {
         result = (await import(fnPath)).default;
      } else {
         result = require(fnPath);
      }
      return result;
   }
   return null;
}

module.exports = {
   loadModule,
   getConfigFile,
};
