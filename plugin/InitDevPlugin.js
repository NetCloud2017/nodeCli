const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = function (api, optinos) {
   const { getWebpackPlugin } = api;
   const config = getWebpackPlugin();
   const dir = process.cwd();

   const mode = "development";
   config.mode = mode;

   // 在 webpack chain  中添加配置
   // 设置 entry
   config.entry("index").add(path.resolve(dir, "./src/index.js"));

   // 设置 output
   config.output.filename("js/[name].js").path(path.resolve(dir, "./dist"));

   // 设置loader
   // css
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
      .test(/\.(png|jpe?g|gif|svg)$/i)
      .type("asset")
      .parser({
         dataUrlCondition: {
            maxSize: 8 * 1024,
         },
      });

   config.module.rule("asset").set("generator", {
      filename: "image/[name].[hash:6][ext]",
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
         template: path.resolve(dir, "./plugin/index.html"),
         chunks: ["index"],
      },
   ]);

   config.plugin("CleanPlugin").use(CleanWebpackPlugin, []);

   config.optimization.usedExports(true);

   config.watch(true);
};
