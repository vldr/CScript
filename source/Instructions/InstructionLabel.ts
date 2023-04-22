import Instruction from "./Instruction";

export default class InstructionLabel extends Instruction
{
    constructor(public readonly value: string)
    {
        super();
    }

    public write(): string
    {
        return `${this.value}:\n`;
    }
}