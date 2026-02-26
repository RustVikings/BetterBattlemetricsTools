const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        worker: path.join(__dirname, "src/worker.ts"),
        options: path.join(__dirname, "src/options/index.tsx"),
        main: path.join(__dirname, "src/index.tsx"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/templates/options.html",
            excludeChunks: ["worker", "main"],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./src/manifest.json",
                    to: path.resolve("dist"),
                },
                {
                    from: "src/icons",
                    to: path.resolve(__dirname, "dist/icons"),
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: "ts-loader",
            },
            // Treat src/css/app.css as a global stylesheet
            {
                test: /\app.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            // Treat src/css/app.css as a global stylesheet
            {
                test: /\options.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            // Load .module.css files as CSS modules
            {
                test: /\.module.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    "postcss-loader",
                ],
            },
        ],
    },
    // Setup @src path resolution for TypeScript files
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "@src": path.resolve(__dirname, "src/"),
        },
    },
};
