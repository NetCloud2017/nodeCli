const fs = require("fs");

const path = require("path");

const DevServer = require("webpack-dev-server");

const WebapckChain = require("webpack-chain");
const log = require("../utils/log");

const { getConfigFile, loadModule } = require("../utils");

const constant = require("./const");
const InitDevPlugin = require("../../plugin/InitDevPlugin");
const InitBuildPlugin = require("../../plugin/InitBuildPlugin");

const CustomHookKeys = [constant.START, constant.PLUGIN];
class Service {
   constructor(cmd, opts) {
      log.verbose("service", opts);

      this.args = opts;
      this.cmd = cmd;
      this.config = {};
      this.hooks = {};
      this.plugins = [];

      this.dir = process.cwd();
      this.webpackConfig = null;
      this.internalValue = {};
      log.verbose("service args", this.args);
   }
   start = async () => {
      console.log("启动服务");
      await this.resolveConfig();
      await this.registerHooks();
      await this.emitHooks(constant.START);
      await this.registerPlugin();

      await this.runPlugin();

      if (!this.args.stopBuild) {
         await this.initWebpack();
         await this.startServer();
      }
   };

   startServer = async () => {
      let compiler;
      let serverConfig;
      try {
         const webpack = require(this.webpack); // 加载本地webpack

         const webpackConfig = this.webpackConfig.toConfig();
         // 生成 编译对象
         compiler = webpack(webpackConfig, (err, stats) => {
            // 编译后回调函数

            if (err) {
               log.error("ERROR!", err);
            } else {
               const res = stats.toJson({
                  all: false,
                  errors: true,
                  warnings: true,
                  timings: true,
               });

               if (res.errors && res.errors.length > 0) {
                  log.error("compile error!");
                  res.error.forEach((error) => {
                     log.error("error message", error.message);
                  });
               } else if (res.warnings && res.warnings.length > 0) {
                  log.warn("compile warning !");
                  res.warnings.forEach((warning) => {
                     log.warn("warning message:", warning.message);
                  });
               } else {
                  log.info(
                     "compile successfully",
                     "compile finish in " + res.time / 1000 + "s"
                  );
               }
            }
         });

         serverConfig = {
            port: this.args.port || 8000,
            host: this.args.host || "0.0.0.0",
            https: this.args.https || false,
         };

         let devServer;
         if (DevServer.getFreePort) {
            devServer = new DevServer(serverConfig, compiler);
         } else {
            devServer = new DevServer(compiler, serverConfig);
         }

         if (devServer.startCallback) {
            devServer.startCallback(() => {
               log.info("webpack dev server launch successfully");
            });
         } else {
            // 低版本写法 好似是 webpack  4 以下。
            devServer.listen(serverConfig.port, serverConfig.host, (err) => {
               if (err) {
                  log.error("webpack dev server launch Error");
                  log.error("error message", err.toString());
               } else {
                  log.info("webpack dev server launch successfully");
               }
            });
         }
      } catch (error) {
         log.error("start server error", error);
      }
   };

   initWebpack = () => {
      // 初始化webpack 用于获取 webpack 框架

      const { customWebpackPath } = this.args;
      if (customWebpackPath) {
         // 自定义 webpack 路径 CustomWebpackPath 存在时，则使用该地址引用 webpack
         if (fs.existsSync(customWebpackPath)) {
            // 判断存不存在这个文件夹
            let p = customWebpackPath;
            if (!path.isAbsolute(p)) {
               // 判断是不是最对路径
               p = path.resolve(p);
            }
            this.webpack = require.resolve(p);
         }
      } else {
         // 否则则使用 node_modules 中的 webpack
         this.webpack = require.resolve("webpack", {
            // 自定义导入 webpack 的路径。
            paths: [path.resolve(process.cwd(), "node_modules")],
         });
      }
      log.verbose("webpack path: ", this.webpack);
      log.verbose("webpack config: ", this.webpackConfig.toConfig());
   };
   resolveConfig = async () => {
      // 解析自定义的配置文件

      const { config } = this.args;
      const configFilePath = "";
      if (config) {
         // 判断 命令行中 --config 的参数是不是绝对路径
         if (path.isAbsolute(config)) {
            configFilePath = config;
         } else {
            configFilePath = path.resolve(config);
         }
      } else {
         configFilePath = getConfigFile({ cwd: this.dir });
      }

      if (configFilePath && fs.existsSync(configFilePath)) {
         this.config = await loadModule(configFilePath);
         log.verbose("config loaded", this.config);
      } else {
         log.error("cli config  file is  not  exsit.");
         process.exit(1);
      }

      // 创建 webpack chain 实例
      this.webpackConfig = new WebapckChain();
   };

   registerHooks = async () => {
      const { hooks } = this.config;
      // 注册自定义钩子
      // 插件以 [fnkey , function]的形式定义
      if (hooks && hooks.length > 0) {
         for (const hook of hooks) {
            const [key, fn] = hook;
            if (
               key &&
               fn &&
               typeof key === "string" &&
               CustomHookKeys.indexOf(key) >= 0
            ) {
               if (typeof fn === "function") {
                  const existHook = this.hooks[key];
                  if (!existHook) {
                     this.hooks[key] = [];
                  }
                  this.hooks[key].push(fn);
               }
            } else if (typeof fn === "string") {
               //可以通过文件路径， 获取插件模块函数
               const newFn = await loadModule(fn);
               if (newFn) {
                  const existHook = this.hooks[key];
                  if (!existHook) {
                     this.hooks[key] = [];
                  }
                  // 感觉这里有问题
                  this.hooks[key].push(newFn);
               }
            }
         }
      }

      log.verbose("register hooks", this.hooks);
   };

   emitHooks = async (key) => {
      log.verbose("emit hooks", key, this.hooks);
      const hooks = this.hooks[key];
      if (hooks) {
         for (const fn of hooks) {
            try {
               await fn(this);
            } catch (err) {
               log.error(err);
            }
         }
      }
   };
}

module.exports = Service;
