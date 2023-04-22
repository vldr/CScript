import Instruction from "./Instruction";

export default class InstructionGETPOPB extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `GETPOPB\n`;
    }
}