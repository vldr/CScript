<p align="center">
    <img src='logo.svg?raw=true' width='50%'>
</p>

---

A C-like toy scripting language written in Typescript.

- [Try it out](#try-it-out)
- [Features](#features)
- [Components](#components)
- [Building and Testing](#building-and-testing)
- [Limitations](#limitations)

## Try it out
You can play around with the language in the [CScript Editor](https://cscript.vldr.org/).

## Features
- Stack-based intermediate-language
- Memory-safety
- Fast compilation times
- Strict type-checking
- Support for *struct*, *array* and 32-bit aligned primitive types &mdash; *uint*, *int*, and *float*
- Feature-rich, web-based editor

## Components
CScript is comprised of two components &mdash; the compiler and the interpreter.

### Compiler
The compiler is responsible for converting the C-like syntax to an intermediate language.

### Interpreter
The interpreter is responsible for executing the intermediate language that is emitted by the compiler. 

## Building and Testing

**Note:** Before building or testing, make sure you have [Node] installed.

### Building
To build the project:

1. Type `npm i`
2. Type `npm run build`

After the build process completes, the `build/` directory will contain all the compiled JavaScript files and the `build/editor/` directory will contain the web-packed compiler and interpreter JavaScript modules.

### Testing

To run the tests for the project:

1. Type `npm i`
2. Type `npm test`

## Limitations

Currently, CScript has two limitations:
1. The inability to move structs by value across function calls.
2. The inability to move arrays by value across function calls.

The consequence is that struct and array types act as global static variables within functions.

[node]: https://nodejs.org/

