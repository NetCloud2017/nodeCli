const detectPort = require("detect-port");
const inquirer = require("inquirer");
const Service = require("./service/Service");
const log = require("../utils/log");

(async function () {
   const DEFAULT_PORT = 8000;
   const params = process.argv.slice(2);
   const paramObj = {};

   params.forEach((param) => {
      const parmaArr = param.split(" ");
      paramObj[parmaArr[0].replace("--", "")] = parmaArr[1];
   });
   log.verbose("devserver", paramObj);

   const { config = "" } = paramObj;
   let defaultPort = paramObj["port"] || DEFAULT_PORT;
   defaultPort = parseInt(defaultPort, 10);

   try {
      const newPort = await detectPort(defaultPort); // 验证端口是否被占用 不被占用就返回原端口。
      if (newPort !== defaultPort) {
         const questions = {
            type: "confirm",
            name: "answer",
            message: `${defaultPort} 端口已被占用， 是否启用新端口 ${newPort} ?`,
         };
         const answer = (await inquirer.prompt(questions)).answer;
         if (!answer) {
            process.exit(1);
         }
      } else {
         console.log("端口号" + defaultPort + "可以使用");
         const args = {
            port: newPort,
            config,
            customWebpackPath: paramObj.customWebpackPath || "",
            stopBuild: paramObj["stop-build"] === "true" || false,
         };
         process.env.NODE_ENV = "development";
         const service = new Service("start", args);
         await service.start();
      }
   } catch (e) {
      console.log(e);
   }
})();
