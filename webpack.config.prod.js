const path = require("path");
const CleanPlugin = require("clean-webpack-plugin"); //distフォルダの中身を毎回最新にするプラグイン

module.exports = {
  mode: "production", //本番用
  entry: "./src/app.ts", //起点になるファイル
  output: {
    //出力先
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), //絶対パス
  },
  devtool: "false",
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
  plugins: [
    // 追加するプラグインを設定
    new CleanPlugin.CleanWebpackPlugin(),
  ],
};
