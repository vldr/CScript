import Instruction from "./Instruction";

export default class InstructionSAVEFRONT extends Instruction
{
    constructor(private _offset: number)
    {
        super();
    }

    public write(): string
    {
        return `SAVEFRONT ${this._offset}\n`;
    }
}