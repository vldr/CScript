import Instruction from "./Instruction";

export default class InstructionComment extends Instruction
{
    constructor(public readonly value: string)
    {
        super();
    }

    public write(): string
    {
        return `# ${this.value}\n`;
    }
}