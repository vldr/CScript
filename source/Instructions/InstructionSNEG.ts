import Instruction from "./Instruction";

export default class InstructionSNEG extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
       return `SNEG\n`;
    }
}