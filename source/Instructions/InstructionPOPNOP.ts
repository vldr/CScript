import Instruction from "./Instruction";

export default class InstructionPOPNOP extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `POPNOP\n`;
    }
}