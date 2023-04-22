import Instruction from "./Instruction";

export default class InstructionFINC extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
       return `FINC\n`;
    }
}