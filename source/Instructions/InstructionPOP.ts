import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionPOP extends Instruction
{
    constructor(private _variable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `POP ${this._variable.labelName}\n`;
    }
}