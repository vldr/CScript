import Instruction from "./Instruction";

export default class InstructionGETPOPA extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `GETPOPA\n`;
    }
}