const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanwebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const tsImportPluginFactory = require('ts-import-plugin');

const isPro = process.env.NODE_ENV === "production";

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "docs"),
        filename: "static/js/[name].[hash:8].min.js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                loader: 'babel-loader',
                exclude: [path.resolve(__dirname, "node_modules")],
            },
            {
                test: /\.(ts|tsx)?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [ tsImportPluginFactory({
                                    libraryName: 'antd',
                                    libraryDirectory: 'es',
                                    style: 'css',
                                }) ]
                            }),
                            compilerOptions: {
                                module: 'es2015'
                            }
                        },
                    },
                ],
                exclude: [path.resolve(__dirname, "node_modules")],
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            // {
            //     test: /\.html$/,
            //     use: [
            //         {
            //             loader: "html-loader",
            //             options: { minimize: true }
            //         }
            //     ]
            // },
            {
                test: /\.(css|less)$/,
                use: [isPro ? MiniCssExtractPlugin.loader : "style-loader", "css-loader", "less-loader",]
            },
            {
                test: /\.(jpg|png)$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'static/images/[hash:8].[name].[ext]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx','.json'],
    },
    // devtool: "inline-source-map",
    plugins: [
        new HtmlWebPackPlugin({
            title: "wereret",
            template: "./src/index.html",
            filename: "./index.html",
            minify: {
                collapseWhitespace: true
            },
            hash: true,
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[hash:8].min.css",
            chunkFilename: "[id].css",
        }),
        new CleanwebpackPlugin(["docs"]),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        port: 9001,
        hot: true,
        // contentBase: './public'
    }
};
