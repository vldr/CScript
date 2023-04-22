import Instruction from "./Instruction";

export default class InstructionREM extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `REM\n`;
    }
}