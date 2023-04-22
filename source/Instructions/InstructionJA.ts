import Instruction from "./Instruction";

export default class InstructionJA extends Instruction
{
    constructor(public readonly value: string)
    {
        super();
    }

    public write(): string
    {
        return `JA ${this.value}\n`;
    }
}