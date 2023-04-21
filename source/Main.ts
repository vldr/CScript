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
                int array[] = {
                    55, 47, 35, 15, 20, 42,
                    52, 30, 58, 15, 13, 19,
                    32, 18, 44, 11, 7, 9,
                    34, 56, 17, 25, 14, 48,
                    40, 4, 5, 7, 36, 1,
                    33, 49, 25, 26, 30, 9
                };
                
                void swap(int i, int j) 
                {
                    int temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                
                int partition(int l, int h) 
                { 
                    int x = array[h]; 
                    int i = (l - 1); 
                
                    for (int j = l; j <= h - 1; j++) 
                    { 
                        if (array[j] <= x) 
                        { 
                            i++; 
                            swap(i, j); 
                        } 
                    } 
                    swap(i + 1, h); 
                
                    return (i + 1); 
                } 

                struct A {
                    int hello;
                };

                void quickSort(int low, int high)
                {
                    int hiu[] = {
                        55, 47, 35, 15, 20, 42,
                        52, 30, 58, 15, 13, 19,
                        32, 18, 44, 11, 7, 9,
                        34, 56, 17, 25, 14, 48,
                        40, 4, 5, 7, 36, 1,
                        33, 49, 25, 26, 30, 9
                    };

                    if (low < high) 
                    {
                        int pi = partition(low, high);

                        quickSort(low, pi - 1);
                        quickSort(pi + 1, high);
                    }
                }

                void print()
                {
                    for (int i = 0; i < array.length; i++)
                    {
                        _println(array[i], " ");
                    }

                }

                int fib(int n)
                {
                    if (n <= 1)
                        return n;

                    return fib(n - 1) + fib(n - 2);
                }
                
                quickSort(0, array.length - 1);
                print();
                _println(fib(18));
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