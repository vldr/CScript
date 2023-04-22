import Instruction from "./Instruction";

export default class InstructionJNA extends Instruction
{
    constructor(public readonly value: string)
    {
        super();
    }

    public write(): string
    {
        return `JNA ${this.value}\n`;
    }
}