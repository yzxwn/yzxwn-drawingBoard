const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanwebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const tsImportPluginFactory = require('ts-import-plugin');

const isDev = process.env.NODE_ENV === "development";

module.exports = {
    entry: {
        "index.bundle": "./src/index.tsx"
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].[hash].js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
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
                use: [isDev ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "url-loader" },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx','.json'],
    },
    devtool: "inline-source-map",
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    plugins: [
        new HtmlWebPackPlugin({
            title: "wereret",
            template: "./src/index.html",
            filename: "./index.html",
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            chunks: ["index.bundle"]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CleanwebpackPlugin(["build"]),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port: 9001,
        hot: true,
        contentBase: './public'
    }
};
