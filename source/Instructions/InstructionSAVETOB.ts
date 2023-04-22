import Instruction from "./Instruction";

export default class InstructionSAVETOB extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `SAVETOB\n`;
    }
}