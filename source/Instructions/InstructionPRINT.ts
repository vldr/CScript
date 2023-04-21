import Instruction from "./Instruction";

export default class InstructionPrint extends Instruction
{
    constructor(public readonly text: string | undefined)
    {
        super();
    }

    public write(): string
    {
        if (this.text)
        {
            return `PRINT ${encodeURI(this.text)}\n`;
        }
        else
        {
            return `PRINT\n`;
        }
    }
}