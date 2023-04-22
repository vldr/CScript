import Instruction from "./Instruction";

export default class InstructionAND extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `AND\n`;
    }
}