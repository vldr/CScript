import Instruction from "./Instruction";

export default class InstructionTICK extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `TICK\n`;
    }
}