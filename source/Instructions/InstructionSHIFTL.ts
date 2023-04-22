import Instruction from "./Instruction";

export default class InstructionSHIFTL extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `SHIFTL\n`;
    }
}