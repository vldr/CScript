import Instruction from "./Instruction";

export default class InstructionINTTOFL extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `INTTOFL\n`;
    }
}