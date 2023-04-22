import Instruction from "./Instruction";

export default class InstructionGETPOPR extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `GETPOPR\n`;
    }
}