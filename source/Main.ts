import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static async start()
    {
        try 
        {
            const compiler = new Compiler();
            const result = compiler.compile(`
                uint binomialCoeff(uint n, uint k)
                {
                    uint res = 1u;
                
                    if (k > n - k)
                        k = n - k;
                
                    for (uint i = 0u; i < k; ++i) {
                        res *= (n - i);
                        res /= (i + 1u);
                    }
                
                    return res;
                }
                
                uint catalan(uint n)
                {
                    uint c = binomialCoeff(2u * n, n);
                
                    return c / (n + 1u);
                }
                
                void run()
                {
                    for (uint i = 0u; i < 15u; i++)
                        _println("Catalan number[", i, "] = ", catalan(i));
                }
                
                run();

                _print("hello");
            `);

            
            const interpreter = new Interpreter();
            await interpreter.run(result);
        }
        catch (exception)
        {
            console.log(exception);
        }
    }
}

Main.start();