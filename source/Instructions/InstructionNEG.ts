import Instruction from "./Instruction";

export default class InstructionNEG extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
       return `NEG\n`;
    }
}