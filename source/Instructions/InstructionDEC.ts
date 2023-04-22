import Instruction from "./Instruction";

export default class InstructionDEC extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
       return `DEC\n`;
    }
}