import Instruction from "./Instruction";

export default class InstructionMOVINPOP extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `MOVINPOP\n`;
    }
}