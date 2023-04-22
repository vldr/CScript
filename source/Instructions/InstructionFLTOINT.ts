import Instruction from "./Instruction";

export default class InstructionFLTOINT extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `FLTOINT\n`;
    }
}