import Instruction from "./Instruction";

export default class InstructionINC extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
       return `INC\n`;
    }
}