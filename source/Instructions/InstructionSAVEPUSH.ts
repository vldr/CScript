import Instruction from "./Instruction";

export default class InstructionSAVEPUSH extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `SAVEPUSH\n`;
    }
}