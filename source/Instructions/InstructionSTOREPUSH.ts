import Instruction from "./Instruction";

export default class InstructionSTOREPUSH extends Instruction
{
    constructor(
        private _value: string,
    )
    {
        super();
    }

    public write(): string
    {
        return `STOREPUSH ${this._value}\n`;
    }
}