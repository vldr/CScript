import Instruction from "./Instruction";

export default class InstructionNOT extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
       return `NOT\n`;
    }
}