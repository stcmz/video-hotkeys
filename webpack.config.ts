import path from "path";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import packageJson from "./package.json";

let devMode: boolean = process.env.NODE_ENV === "development";

// Webpack Configuration
// https://webpack.js.org/configuration/
const config: webpack.Configuration = {
    mode: devMode ? "development" : "production",
    devtool: devMode ? "inline-source-map" : undefined,
    entry: {
        content: "./src/Main.ts",
        proxy: "./src/Proxy.ts",
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
                {
                    from: "./manifest.json",
                    transform: content => {
                        let manifest = JSON.parse(content.toString());

                        manifest.version = packageJson.version;
                        manifest.author = packageJson.author;

                        return JSON.stringify(manifest);
                    }
                },
                {
                    from: "./manifest.json",
                    to: "./manifest-v2.json",
                    transform: content => {
                        let manifest = JSON.parse(content.toString());

                        manifest.manifest_version = 2;
                        manifest.version = packageJson.version;
                        manifest.author = packageJson.author;
                        manifest.web_accessible_resources = manifest.web_accessible_resources[0].resources;

                        return JSON.stringify(manifest);
                    }
                },
                {
                    from: "./src/Locales",
                    to: "_locales",
                    filter: o => o.endsWith(".json")
                },
                { from: "./src/Assets/logo128.png" },
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