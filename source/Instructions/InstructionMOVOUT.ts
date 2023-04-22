import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionMOVOUT extends Instruction
{
    constructor(private _destinationVariable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `MOVOUT ${this._destinationVariable.labelName}\n`;
    }
}