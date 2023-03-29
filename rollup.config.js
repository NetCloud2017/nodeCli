const path = require("path");
const babel = require("@rollup/plugin-babel");
const livereload = require("rollup-plugin-livereload");
const serve = require("rollup-plugin-serve");
const babelConfig = require("./babel.config");
function devConfig(entry = "index.jsx") {
  return {
    input: path.resolve(process.cwd(), entry),
    output: {
      file: path.resolve(process.cwd(), "dist/bundle.js"),
      format: "iife",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
    },
    external: ["react", "react-dom"],
    plugins: [
      babel(babelConfig),
      livereload(),
      serve({
        openPage: path.resolve(process.cwd(), "index.html"),
        port: 4000,
        contentBase: "./",
      }),
    ],
  };
}
module.exports = {
  devConfig,
};
