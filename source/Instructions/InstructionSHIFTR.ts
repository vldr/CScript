import Instruction from "./Instruction";

export default class InstructionSHIFTR extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `SHIFTR\n`;
    }
}