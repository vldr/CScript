import Instruction from "./Instruction";

export default class InstructionFNEG extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
       return `FNEG\n`;
    }
}