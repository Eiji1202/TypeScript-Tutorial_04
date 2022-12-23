const path = require("path");

module.exports = {
  mode: "development", //開発中は設定しておく。minify等の最適化が行われない
  entry: "./src/app.ts", //起点になるファイル
  output: {
    //出力先
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), //絶対パス
    publicPath: "/dist", //開発中は設定しておく
  },
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, "dist"),
        publicPath: "/dist",
      },
      {
        directory: __dirname,
        publicPath: "/",
      },
    ],
  },
  devtool: "eval",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
