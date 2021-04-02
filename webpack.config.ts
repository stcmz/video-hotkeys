import path from "path";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";

let devMode: boolean = process.env.NODE_ENV === "development";

// Webpack Configuration
// https://webpack.js.org/configuration/
const config: webpack.Configuration = {
    mode: devMode ? "development" : "production",
    devtool: devMode ? "eval-source-map" : undefined,
    entry: {
        content: "./src/Main.ts",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.ts$/,
                use: "ts-loader",
            },
            {
                test: /\.svg$/,
                type: "asset/source",
            },
        ],
    },
    plugins: [
        <any>new CopyPlugin({
            patterns: [
                { from: "./manifest.json" },
                { from: "./assets/logo128.png" }
            ],
        }),
    ],
    resolve: {
        extensions: [".ts"],
    },
    performance: {
        hints: false
    }
};

export default config;