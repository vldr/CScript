importScripts("interpreter.js");

onmessage = async (event) => 
{
    const data = event.data;

    switch (data.type)
    {
        case "start": 
        {
            const interpreter = new Interpreter();
            interpreter.setOutput((text) => { postMessage({ type: "print", text }) });

            try 
            {
                await interpreter.run(data.bytecode);

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