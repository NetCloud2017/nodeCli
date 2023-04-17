const fs = require("fs");

const path = require("path");

const DevServer = require("webpack-dev-server");

const WebapckChain = require("webpack-chain");
const log = require("../utils/log");

const constant = require("./const");
const InitDevPlugin = require("../../plugin/InitDevPlugin");
const InitBuildPlugin = require("../../plugin/InitBuildPlugin");

class Service {
   constructor(opts) {
      this.args = opts;
      this.config = {};
      this.hooks = {};
   }
   async start() {
      console.log("启动服务");
      this.resolveConfig();
   }
   resolveConfig() {
      console.log("解析配置文件");
   }
}

module.exports = Service;
