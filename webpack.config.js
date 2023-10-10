const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.build.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          { loader: "sass-loader" },
        ],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".tsx", ".ts"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "react-ultimate-calendar",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: {
    react: "react",
  },
};
