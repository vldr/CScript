import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionMOV extends Instruction
{
    constructor(
        private _srcVariable: Variable,
        private _dstVariable: Variable
    )
    {
        super();
    }

    public write(): string
    {
        return `MOV ${this._srcVariable.labelName} ${this._dstVariable.labelName}\n`;
    }
}