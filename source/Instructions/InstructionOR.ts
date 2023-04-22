import Instruction from "./Instruction";

export default class InstructionOR extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `OR\n`;
    }
}