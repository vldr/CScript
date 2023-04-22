import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionGETB extends Instruction
{
    constructor(private _variable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `GETB ${this._variable.labelName}\n`;
    }
}