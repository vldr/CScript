import Instruction from "./Instruction";

export default class InstructionSAVEPUSHA extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `SAVEPUSHA\n`;
    }
}