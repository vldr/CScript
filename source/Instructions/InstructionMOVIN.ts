import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionMOVIN extends Instruction
{
    constructor(private _destinationVariable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `MOVIN ${this._destinationVariable.labelName}\n`;
    }
}