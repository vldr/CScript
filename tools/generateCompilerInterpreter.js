const { exec } = require("child_process");

const INPUT_COMPILER_PATH = "build/editor/compiler.js";
const OUTPUT_COMPILER_PATH = "editor/compiler.js";

const INPUT_INTERPRETER_PATH = "build/editor/interpreter.js";
const OUTPUT_INTERPRETER_PATH = "editor/interpreter.js";

exec(`npx google-closure-compiler --js=${INPUT_COMPILER_PATH} --js_output_file=${OUTPUT_COMPILER_PATH}`);
exec(`npx google-closure-compiler --js=${INPUT_INTERPRETER_PATH} --js_output_file=${OUTPUT_INTERPRETER_PATH}`);