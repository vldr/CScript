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
        this.print("Program has been started.\n");
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
    
        this.setStatus(`Press 'Run' to start a program. <br><span>(Program ran for ${this.executionTime.toFixed(1)} seconds.)</span>`);
    }

    clear()
    {
        this.consoleOutput.textContent = "";
    }

    print(text)
    {
        this.consoleOutput.textContent += text;
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
            this.print("Program has been terminated.\n");
        }
    } 

    onTimer() 
    {
        this.executionTime += 0.1;
        this.setStatus(`Program has been running for ${this.executionTime.toFixed(1)} seconds.`);
    }

    onWorkerError()
    {
        this.stop();
        this.print("Program was terminated unexpectedly.\n");
    }

    onWorkerMessage(event)
    {
        const data = event.data;

        switch (data.type)
        {
            case "stop": 
            {
                this.print("Program has finished executing.\n");
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
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });
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
                    "int",
                    "uint",
                    "float",
                    "struct",
                    "const",
                    
                    "_print",
                    "_println",
                    
                    "_tick",
                    "_urand",
                    "void", 
                    "return", 
                    "do", 
                    "for", 
                    "while", 
                    "break", 
                    "continue", 
                    "if", 
                    "else",
                ],
                operators: [
                    "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=",
                    "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^", "%",
                    "<<", ">>", ">>>", "+=", "-=", "*=", "/=", "&=", "|=", "^=",
                    "%=", "<<=", ">>=", ">>>="
                ],
                symbols:  /[=><!~?:&|+\-*\/\^%]+/,
                tokenizer: {
                    root: [
                        [/\d+\.[fF]/, "number"],
                        [/\d*\.\d+([eE][\-+]?\d+)?[Ff]?/, "number"],
                        [/0[xX][0-9a-fA-F]+[uU]/, "number"],
                        [/0[xX][0-9a-fA-F]+/, "number"],
                        [/\d+[uU]/, "number"],
                        [/\d+/, "number"],
                        [/[a-zA-Z_$][\w$]*/, { cases: { "@keywords": "opcode","@default": "address" } }], { include: "@whitespace" },
                        [/[{}()\[\]]/, "default"],
                        [/@symbols/, { cases: { "@operators": "label", "@default"  : "" } } ],
                        [/[;,.]/, "default"],
                    ],
                    
                    comment: [
                        [/[^\/*]+/, "comment" ],
                        [/\/\*/,    "comment", "@push" ],
                        ["\\*/",    "comment", "@pop"  ],
                        [/[\/*]/,   "comment" ]
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
                    { token: "opcode", foreground: "004eff", bold: true },
                    { token: "address", foreground: "038b7e" },
                    { token: "number", foreground: "19a300" },
                    { token: "label", foreground: "004eff" },
                    { token: "comment", foreground: "048918" },
                    { token: "default", foreground: "858585" },
                ],
                colors: {
                    "editorLineNumber.foreground": "#858585"
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