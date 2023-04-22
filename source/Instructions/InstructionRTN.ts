import Instruction from "./Instruction";

export default class InstructionRTN extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `RTN\n`;
    }
}