import Instruction from "./Instruction";

export default class InstructionMOVOUTPUSH extends Instruction
{
    constructor()
    {
        super();
    }

    public write(): string
    {
        return `MOVOUTPUSH\n`;
    }
}