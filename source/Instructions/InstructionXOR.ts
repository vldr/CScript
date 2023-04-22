import Instruction from "./Instruction";

export default class InstructionXOR extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `XOR\n`;
    }
}