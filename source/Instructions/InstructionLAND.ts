import Instruction from "./Instruction";

export default class InstructionLAND extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `LAND\n`;
    }
}