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
                int arr[] = {
                    55, 47, 35, 15, 20, 42,
                    52, 30, 58, 15, 13, 19,
                    32, 18, 44, 11, 7, 9,
                    34, 56, 17, 25, 14, 48,
                    40, 4, 5, 7, 36, 1,
                    33, 49, 25, 26, 30, 9
                };
                
                struct Test {
                    int arr_ay[arr.length];
                    int arr[arr.length];
                };
                
                Test test;

                void copy(int a)
                {
                    for (int i = 0; i < arr.length; i++)
                    {
                        _print(i);

                        test.arr_ay[i] = arr[i];
                    }
                }

                copy(12);

                _print(test.arr_ay);
            `);

            const interpreter = new Interpreter(result);
            await interpreter.run();
        }
        catch (exception)
        {
            console.log("Exception", exception);
        }
    }
}

Main.start();