const path = require('path');

module.exports = [
    {
        entry: "./build/source/Compiler.js",
        mode: "production",
        output: {
            path: path.resolve(__dirname, 'build/editor'),
            filename: 'compiler.js',
            library: {
                name: 'Compiler',
                type: 'var',
                export: 'default',
            },
        },
    },
    {
        entry: "./build/source/Interpreter.js",
        mode: "production",
        output: {
            path: path.resolve(__dirname, 'build/editor'),
            filename: 'interpreter.js',
            library: {
                name: 'Interpreter',
                type: 'var',
                export: 'default',
            },
        },
    }
];