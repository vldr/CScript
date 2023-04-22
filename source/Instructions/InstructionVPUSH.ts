import Instruction from "./Instruction";

export default class InstructionVPUSH extends Instruction
{
    constructor(private _value: string)
    {
        super();
    }

    public write(): string
    {
        return `VPUSH ${this._value}\n`;
    }
}