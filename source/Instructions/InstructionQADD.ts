import Instruction from "./Instruction";

export default class InstructionQADD extends Instruction
{
    constructor(private _valueA: string, private _valueB: string)
    {
        super();
    }

    public write(): string
    {
        return `QADD ${this._valueA} ${this._valueB}\n`;
    }
}