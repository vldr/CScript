import Instruction from "./Instruction";

export default class InstructionVGETA extends Instruction
{
    constructor(private _value: string)
    {
        super();
    }

    public write(): string
    {
        return `VGETA ${this._value}\n`;
    }
}