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
                
                int findMin(int start, int end)
                {
                    int indexSmallest = start;
                    
                    for (int i = start; i < end; i++)
                    {
                        if (array[i] < array[indexSmallest])
                        {
                            indexSmallest = i;
                        }
                    }
                    return indexSmallest;
                }

                int L[arr.length];
                int R[arr.length];

                void merge(int l, int m, int r)
                {
                    int i, j, k;
                    int n1 = m - l + 1;
                    int n2 = r - m;
                
                    for (i = 0; i < n1; i++)
                        L[i] = arr[l + i];

                    for (j = 0; j < n2; j++)
                        R[j] = arr[m + 1 + j];
                
                    i = 0;
                    j = 0;
                    k = l;
                    while (i < n1 && j < n2) 
                    {
                        if (L[i] <= R[j]) {
                            arr[k] = L[i];
                            i++;
                        }
                        else {
                            arr[k] = R[j];
                            j++;
                        }
                        k++;
                    }
                
                    while (i < n1) {
                        arr[k] = L[i];
                        i++;
                        k++;
                    }
                
                    while (j < n2) {
                        arr[k] = R[j];
                        j++;
                        k++;
                    }
                }
                
                void mergeSort(int l, int r)
                {
                    if (l < r) 
                    {
                        int m = l + (r - l) / 2;

                        mergeSort(l, m);
                        mergeSort(m + 1, r);
                
                        merge(l, m, r);

                        int start = l;
                        int end = r + 1;

                        for (int i = start; i < end - 1; i++)
                        {
                            int indexSmallest = findMin(i + 1, end);
                            
                            if (array[indexSmallest] < array[i])
                            {
                                swap(i, indexSmallest);
                            }
                        }
                    }
                }
                
                void print()
                {
                    for (int i = 0; i < array.length; i++)
                    {
                        _println(array[i]);
                    }
                }

                mergeSort(0, arr.length - 1);
                print();
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