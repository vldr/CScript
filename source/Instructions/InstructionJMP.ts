import Instruction from "./Instruction";

export default class InstructionJMP extends Instruction
{
    constructor(public readonly value: string)
    {
        super();
    }

    public write(): string
    {
        return `JMP ${this.value}\n`;
    }
}