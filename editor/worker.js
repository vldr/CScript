importScripts("interpreter.js");

this.interpreter = new Interpreter();
this.interpreter.setOutput((text) => 
{ 
    postMessage({ type: "print", text });
});

onmessage = async (event) => 
{
    const data = event.data;

    switch (data.type)
    {
        case "start": 
        {
            try 
            {
                await this.interpreter.run(data.bytecode);

                postMessage({ type: "stop" });
            } 
            catch (error)
            {
                postMessage({ type: "error", message: error.message });
            }

            break;
        }
    }
}