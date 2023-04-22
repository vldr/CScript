import Instruction from "./Instruction";

export default class InstructionSAVETOA extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `SAVETOA\n`;
    }
}