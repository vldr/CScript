const path = require('path');

module.exports = [
    {
        entry: "./dist/source/Compiler.js",
        mode: "production",
        output: {
            path: path.resolve(__dirname, 'editor'),
            filename: 'compiler.js',
            library: {
                name: 'Compiler',
                type: 'var',
                export: 'default',
            },
        },
    },
    {
        entry: "./dist/source/Interpreter.js",
        mode: "production",
        output: {
            path: path.resolve(__dirname, 'editor'),
            filename: 'interpreter.js',
            library: {
                name: 'Interpreter',
                type: 'var',
                export: 'default',
            },
        },
    }
];