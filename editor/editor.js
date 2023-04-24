class EditorConsole
{
    constructor() 
    {
        this.running = false;
        this.bytecode = "HALT";

        this.consoleStatus = document.getElementById("console-status");
        this.consoleOutput = document.getElementById("console-output"); 
        this.consoleButton = document.getElementById("console-action");
        this.consoleButtonText = document.getElementById("console-action-text");
        this.consoleButtonStartIcon = document.getElementById("console-action-start-icon");
        this.consoleButtonStopIcon = document.getElementById("console-action-stop-icon");

        this.consoleButton.onclick = () => this.onClick();
    }

    start()
    {
        if (this.running)
        {
            throw new Error("interpreter is already running");
        }

        if (this.worker)
        {
            throw new Error("worker is not undefined");
        }

        this.running = true;

        this.consoleButtonText.innerText = "Stop";
        this.consoleButtonStopIcon.style.display = "";
        this.consoleButtonStartIcon.style.display = "none";

        this.executionTime = 0;
        this.executionTimer = setInterval(() => this.onTimer(), 100);

        this.worker = new Worker("worker.js");
        this.worker.onerror = () => this.onWorkerError();
        this.worker.onmessageerror = () => this.onWorkerError();
        this.worker.onmessage = (event) => this.onWorkerMessage(event);
        this.worker.postMessage({ type: "start", bytecode: this.bytecode });

        this.clear();
        this.onTimer();
    }

    stop()
    {
        if (!this.running) 
        { 
            throw new Error("interpreter is already stopped"); 
        }

        if (!this.worker)
        {
            throw new Error("worker is undefined");
        }

        this.running = false;

        this.consoleButtonText.innerText = "Run";
        this.consoleButtonStopIcon.style.display = "none";
        this.consoleButtonStartIcon.style.display = "";
        
        this.worker.terminate();
        this.worker = undefined;

        clearInterval(this.executionTimer);
        this.executionTimer = undefined;
    
        this.setStatus(`Press "Run" to start a program. <br><span>(Program ran for ${this.executionTime.toFixed(1)} seconds.)</span>`);
    }

    clear()
    {
        this.consoleOutput.textContent = "";
    }

    print(text)
    {
        this.consoleOutput.innerHTML += text;
    }

    onClick()
    {
        if (!this.running)
        {
            this.start();
        }
        else
        {
            this.stop();
            this.print("Program was terminated.\n");
        }
    } 

    onTimer() 
    {
        this.setStatus(`Program is running. (${this.executionTime.toFixed(1)} seconds)`);
        this.executionTime += 0.1;
    }

    onWorkerError()
    {
        this.stop();
        this.print("Program exited unexpectedly due to an error.\n");
    }

    onWorkerMessage(event)
    {
        const data = event.data;

        switch (data.type)
        {
            case "stop": 
            {
                this.print("Program exited.\n");
                this.stop();

                break;
            }

            case "print": 
            {
                this.print(data.text);

                break;
            }

            case "error":
            {
                this.onWorkerError();
                this.print("\n");
                this.print(data.message);

                break;
            }
        }
    }

    setStatus(status)
    {
        this.consoleStatus.innerHTML = status;
    }

    setBytecode(bytecode)
    {
        this.bytecode = bytecode;
    }
}

class Editor
{
    constructor() 
    {
        require.config({ paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs" } });
        require(["vs/editor/editor.main"], () => {
            monaco.languages.register({ id: "cscript" });
            monaco.languages.setLanguageConfiguration("cscript",
            {
                "surroundingPairs": [{"open":"{","close":"}"}, {"open":"(","close":")"}, {"open":"[","close":"]"}],
                "autoClosingPairs": [{"open":"{","close":"}"}, {"open":"(","close":")"}, {"open":"[","close":"]"}],
                "brackets":[["{","}"], ["(",")"], ["[","]"],]
            }
            );
            
            monaco.languages.setMonarchTokensProvider("cscript", {
                keywords: [ 
                    "const",
                    "return", 
                    "do", 
                    "for", 
                    "while", 
                    "break", 
                    "continue", 
                    "if", 
                    "else",
                    "_print",
                    "_println",
                    "_tick",
                    "_urand",
                ],
                
                typeKeywords: [
                    "struct",
                    "void",
                    "int",
                    "uint",
                    "float",
                ],
                
                operators: [
                    "=", ">", "<", "!", "~", "==", "<=", ">=", "!=",
                    "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^", "%",
                    "<<", ">>", "+=", "-=", "*=", "/=", "&=", "|=", "^=",
                    "%=", "<<=", ">>="
                ],
                
                symbols: /[=><!~?:&|+\-*\/\^%]+/,
                escapes: /\\(?:[abfnrtv\\""]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

                tokenizer: {
                    root: [
                        [/[a-z_$][\w$]*/, { cases: { "@typeKeywords": "keyword",
                                                    "@keywords": "keyword",
                                                    "@default": "identifier" } }],
                        [/[A-Z][\w\$]*/, "type.identifier" ],
                        { include: "@whitespace" },

                        [/[{}()\[\]]/, "@brackets"],
                        [/[<>](?!@symbols)/, "@brackets"],
                        [/@symbols/, { cases: { "@operators": "operator",
                                                "@default"  : "" } } ],

                        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
                        [/0[xX][0-9a-fA-F]+u/, 'number.hex'],
                        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                        [/\d+u/, 'number'],
                        [/\d+/, 'number'],

                        [/[;,.]/, "delimiter"],

                        [/"([^"\\]|\\.)*$/, "string.invalid" ],
                        [/"/,  { token: "string.quote", bracket: "@open", next: "@string" } ],

                        [/"[^\\"]"/, "string"],
                        [/(")(@escapes)(")/, ["string","string.escape","string"]],
                        [/"/, "string.invalid"]
                    ],
                
                    comment: [
                        [/[^\/*]+/, "comment" ],
                        [/\/\*/,    "comment", "@push" ],
                        ["\\*/",    "comment", "@pop"  ],
                        [/[\/*]/,   "comment" ]
                    ],
                
                    string: [
                        [/[^\\"]+/,  "string"],
                        [/@escapes/, "string.escape"],
                        [/\\./,      "string.escape.invalid"],
                        [/"/,        { token: "string.quote", bracket: "@close", next: "@pop" } ]
                    ],
                
                    whitespace: [
                        [/[ \t\r\n]+/, "white"],
                        [/\/\*/,       "comment", "@comment" ],
                        [/\/\/.*$/,    "comment"],
                    ],
                },
            });

            monaco.editor.defineTheme("cscript", {
                base: "vs",
                inherit: true,
                rules: [
                ],
                colors: {
                    "editorLineNumber.foreground": "#858585",
                    "editor.paddingTop": "10px",
                    "scrollbar.shadow": "#00000000"
                }
            });

            this.model = monaco.editor.createModel("", "cscript"); 
            this.editorElement = document.getElementById("editor");
            this.editor = monaco.editor.create(this.editorElement, {
                theme: "cscript",
                lineNumbers: "on",
                model: this.model,
                automaticLayout: true,
                scrollBeyondLastLine: true,
                minimap: { enabled: false },
                fixedOverflowWidgets: true
            });

            this.editor.layout();
            this.editor.onDidChangeModelContent(() => this.onInput());
            this.deltaDecorationsList = [];
        });

        this.editorConsole = new EditorConsole(this);    
    }

    onInput() 
    {
        let markersList = [];
        let compiler = new Compiler();

        let text = this.editor.getValue();
        let bytecode = "HALT";

        try
        {
            bytecode = compiler.compile(text);
        }
        catch (error)
        {
            markersList.push({
                startLineNumber: error.location.start.line,
                endLineNumber: error.location.end.line,
                startColumn: error.location.start.column,
                endColumn: error.location.end.column,
                message: error.message,
                severity: monaco.MarkerSeverity.Error
            });
        }

        this.editorConsole.setBytecode(bytecode);
        this.deltaDecorationsList = this.editor.deltaDecorations(this.deltaDecorationsList, compiler.getSymbols().map((symbol) =>
        {
            const location = symbol.location;
            const className = symbol.className;

            return {
                range: new monaco.Range(location.start.line, location.start.column, location.end.line, location.end.column),
                options: { inlineClassName: className }
            };
        }));

        for (const warning of compiler.getWarnings())
        {
            markersList.push({
                startLineNumber: warning.location.start.line,
                endLineNumber: warning.location.end.line,
                startColumn: warning.location.start.column,
                endColumn: warning.location.end.column,
                message: warning.message,
                severity: monaco.MarkerSeverity.Warning
            });
        }

        monaco.editor.setModelMarkers(this.model, "owner", markersList);
    }
}

new Editor();