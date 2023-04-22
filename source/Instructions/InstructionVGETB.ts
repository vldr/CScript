import Instruction from "./Instruction";

export default class InstructionVGETB extends Instruction
{
    constructor(private _value: string)
    {
        super();
    }

    public write(): string
    {
        return `VGETB ${this._value}\n`;
    }
}