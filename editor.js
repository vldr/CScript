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

        this.executionStartTime = performance.now();
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
        this.executionTime = (performance.now() - this.executionStartTime) / 1000;
    
        this.setStatus(`Press "Run" to start a program. <br><span>(Program ran for ${this.executionTime.toFixed(3)} seconds.)</span>`);
    }

    clear()
    {
        this.consoleOutput.textContent = "";
    }

    print(text)
    {
        let shouldScrollToBottom = Math.abs(
            this.consoleOutput.scrollHeight - 
            this.consoleOutput.scrollTop - 
            this.consoleOutput.clientHeight
        ) < 1;

        this.consoleOutput.innerHTML += text;

        if (shouldScrollToBottom)
        {
            this.consoleOutput.scrollTo(0, this.consoleOutput.scrollHeight);
        }
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
        this.executionTime = (performance.now() - this.executionStartTime) / 1000;
        this.setStatus(`Program is running. (${this.executionTime.toFixed(1)} seconds)`);
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

class EditorTabs
{
    #LOCAL_STORAGE_KEY = "CScript"

    constructor(editor)
    {
        this.editor = editor;

        this.tabIndex = 0;
        this.tabs = [];

        this.tabElements = document.getElementById("editor-tabs-list");
        this.tabElements.onwheel = (event) => { event.preventDefault(); this.tabElements.scrollLeft += event.deltaY; };

        this.addTabButton = document.getElementById("editor-tabs-add-button");
        this.addTabButton.onclick = () => this.addTab();
    }

    load()
    {
        const json = JSON.parse(window.localStorage.getItem(this.#LOCAL_STORAGE_KEY));

        if (!json)
        {
            this.tabIndex = 0;
            this.tabs.push({name: "fibonacci", text: `/**\n * fibonacci \n * Calculates Nth fibonacci number.\n */\nuint fibonacci(uint n)\n{\n    uint previousPreviousNumber, previousNumber = 0u, currentNumber = 1u;\n\n    for (uint i = 1u; i < n; i++) \n    {\n        previousPreviousNumber = previousNumber;\n        previousNumber = currentNumber;\n        currentNumber = previousPreviousNumber + previousNumber;\n    }\n\n    return currentNumber;\n}\n\n/**\n * print \n * Prints all the fibonacci numbers that can fit inside a 32-bit integer. \n */\nvoid print()\n{\n    for (uint i = 1u; i <= 47u; i++)\n    {\n        _println("fibonacci(", i, ") = ", fibonacci(i));\n    }\n}\n\nprint();` });
            this.tabs.push({name: "quick_sort", text: `/**\n * array\n * The array we wish to sort.\n */\nint array[] = {\n    55, 47, 35, 15, 20, 42,\n    52, 30, 58, 15, 13, 19,\n    32, 18, 44, 11, 7, 9,\n    34, 56, 17, 25, 14, 48,\n    40, 4, 5, 7, 36, 1,\n    33, 49, 25, 26, 30, 9\n}; \n\n/**\n * swap \n * Swaps two numbers in the array.\n */\nvoid swap(int i, int j) \n{\n    int temp = array[i];\n    array[i] = array[j];\n    array[j] = temp;\n}\n\n/**\n * partition \n * Partitions the values between l and h.\n */\nint partition(int l, int h) \n{ \n    int x = array[h]; \n    int i = (l - 1); \n\n    for (int j = l; j <= h - 1; j++) \n    { \n        if (array[j] <= x) \n        { \n            i++; \n            swap(i, j); \n        } \n    } \n    swap(i + 1, h); \n\n    return (i + 1); \n} \n\n/**\n * quickSort \n * Performs the quick sort algorithm.\n */\nvoid quickSort(int low, int high)\n{\n    if (low < high) \n    {\n        int pi = partition(low, high);\n        \n        quickSort(low, pi - 1);\n        quickSort(pi + 1, high);\n    }\n}\n\n/**\n * print \n * Sorts and prints the contents of the array.\n */\nvoid print()\n{\n    quickSort(0, array.length - 1);\n\n    for (int i = 0; i < array.length; i++)\n    {\n        _println("array[", i, "] = ", i);\n    }\n}\n\nprint();` });
        }
        else
        {
            this.tabs = json.tabs;
            this.tabIndex = json.tabIndex;
        }

        this.selectTab(this.tabIndex);
    }
    
    save()
    {
        const json = JSON.stringify({ tabIndex: this.tabIndex, tabs: this.tabs });

        window.localStorage.setItem(this.#LOCAL_STORAGE_KEY, json);
    }

    render()
    {
        this.tabElements.innerHTML = "";

        let activeTab;

        for (let index = 0; index < this.tabs.length; index++)
        {
            const tab = this.tabs[index];

            const tabElement = document.createElement("div");
            tabElement.onclick = () => this.selectTab(index);
            tabElement.className = "editor-tab";
            tabElement.innerHTML = `
                <div class="editor-tab-icon">CS</div>
                ${tab.name}
            `;

            if (this.tabIndex == index)
            {
                const removeTabElement = document.createElement("div");
                removeTabElement.onclick = (event) => { event.stopPropagation(); this.removeTab(); };
                removeTabElement.className = "editor-tab-delete";
                removeTabElement.innerHTML = `
                    <svg class="editor-tab-delete" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" 
                        viewBox="0 0 357 357" xml:space="preserve">
                        <polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 "/>     
                    </svg>
                `;

                tabElement.className += " editor-tab-active";
                tabElement.appendChild(removeTabElement);

                activeTab = tabElement;
            }

            this.tabElements.appendChild(tabElement);
        }

        if (activeTab)
        {
            activeTab.scrollIntoView();
        }
    }

    addTab()
    {
        const name = prompt("Please enter a name:");

        if (name) 
        {
            this.tabs.push({ name, text: "" });

            this.save();
            this.selectTab(this.tabs.length - 1);
        }
    }

    removeTab()
    {
        if (confirm(`Are you sure you want to delete '${this.tabs[this.tabIndex].name}'?`))
        {
            this.tabs.splice(this.tabIndex, 1);
            this.save();

            if (this.tabIndex == this.tabs.length)
            {
                this.selectTab(this.tabIndex - 1);
            }
            else
            {
                this.selectTab(this.tabIndex);
            }
            
        }       
    }

    selectTab(index)
    {
        if (index < 0 || index >= this.tabs.length)
        {
            this.tabIndex = 0;
        }
        else
        {
            this.tabIndex = index;
        }

        if (this.tabs.length)
        {
            this.editor.setText(this.tabs[this.tabIndex].text);
            this.editor.setReadOnly(false);
        }
        else
        {
            this.editor.setText("");
            this.editor.setReadOnly(true);
        }
  
        this.render();
    }

    setText(text)
    {
        if (this.tabIndex < 0 || this.tabIndex >= this.tabs.length)
        {
            return;
        }

        this.tabs[this.tabIndex].text = text;
        this.save();
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
                rules: [],
                colors: {
                    "editorLineNumber.foreground": "#858585",
                    "editor.paddingTop": "10px",
                    "scrollbar.shadow": "#00000000"
                }
            });
                  
            this.model = monaco.editor.createModel("", "cscript"); 

            this.editorDeltaDecorationsList = [];
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
            
            this.editorConsole = new EditorConsole();    
            this.editorTabs = new EditorTabs(this);
            
            this.editor.layout();
            this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {});
            this.editor.onDidChangeModelContent(() => this.onInput());

            this.editorTabs.load();
        });
    }

    setText(text)
    {
        this.editor.setValue(text);
        this.editor.setScrollPosition({ scrollTop: 0 });
    }

    setReadOnly(value)
    {
        this.editor.updateOptions({readOnly: value});
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

        this.editorTabs.setText(text);
        this.editorConsole.setBytecode(bytecode);

        this.editorDeltaDecorationsList = this.editor.deltaDecorations(this.editorDeltaDecorationsList, compiler.getSymbols().map((symbol) =>
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