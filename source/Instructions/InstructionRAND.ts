import Instruction from "./Instruction";

export default class InstructionRAND extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `RAND\n`;
    }
}