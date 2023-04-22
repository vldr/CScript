import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionPUSH extends Instruction
{
    constructor(private _variable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `PUSH ${this._variable.labelName}\n`;
    }
}