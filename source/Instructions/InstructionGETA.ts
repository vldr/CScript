import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionGETA extends Instruction
{
    constructor(private _variable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `GETA ${this._variable.labelName}\n`;
    }
}