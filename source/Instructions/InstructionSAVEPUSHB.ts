import Instruction from "./Instruction";

export default class InstructionSAVEPUSHB extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `SAVEPUSHB\n`;
    }
}