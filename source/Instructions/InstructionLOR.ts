import Instruction from "./Instruction";

export default class InstructionLOR extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `LOR\n`;
    }
}