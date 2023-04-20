const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = function (api, options) {
   const { getWebpackConfig } = api;
   const config = getWebpackConfig();
   const dir = process.cwd();

   // mode
   const cmd = api.getCommand();

   let mode;
   if (cmd === "build") {
      mode = "production";
   } else {
      mode = process.env.MODE || "development";
   }
   config.mode(mode);

   // 设置entry

   config.entry("index").add(path.resolve(dir, "./src/index.js"));

   //  output
   config.output.filename("js/[name].js").path(paht.resolve(dir, "./dist"));

   // loader

   config.module
      .rule("css")
      .test(/\.css$/)
      .exclude.add(/node_modules/)
      .end()
      .use("mini-css")
      .loader(MiniCssExtractPlugin.loader)
      .end()
      .use("css-loader")
      .loader("css-loader");

   config.module
      .rule("asset")
      .test(/\.(png|svg|jpg|jpeg|gif)$/i)
      .type("asset")
      .parser({
         dataUrlCondition: {
            maxSize: 8 * 1024,
         },
      });
   config.module.rule("asset").set("generator", {
      filename: "images/[name].[hash:6][ext]",
   });

   config.plugin("MiniCssExtractPlugin").use(MiniCssExtractPlugin, [
      {
         filename: "css/[name].css",
         chunkFilename: "css/[name].chunk.css",
      },
   ]);

   config.plugin("HtmlWebpackPlugin").use(HtmlWebpackPlugin, [
      {
         filename: "index.html",
         template: path.resolve(dir, "./public/index.html"),
         chunks: ["index"],
      },
   ]);

   config.plugin("CleanPlugin").use(CleanWebpackPlugin, []);

   config.optimization
      .minimize(true)
      .usedEports(true)
      .splitChunks({
         chunks: "all",
         minSize: 30 * 1024, // 300 kb 以上的包就会分割
         name: "common",
         cacheGroups: {
            // 单独对某个包打包
            jquery: {
               // 要打包的包
               name: "jquery", // 打包成的名字 , output 的hash 对这里也有效 。 还有的就是 jquery 这个包的大小也要符合 miniSize 这个选项。
               test: /jquery/, // 是 jauery.js 的文都打包
               chunks: "all",
            },
            "lodash-es": {
               name: "lodash-es",
               test: /lodash-es/,
               chunks: "all",
            },
         },
      });

   config.watch(true);
};
