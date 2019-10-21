const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "react-ultimate-calendar",
    libraryTarget: "umd",
    globalObject: "this"
  },
  externals: {
    react: "react"
  }
};
