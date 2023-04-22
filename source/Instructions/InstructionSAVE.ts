import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionSAVE extends Instruction
{
    constructor(private _destinationVariable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `SAVE ${this._destinationVariable.labelName}\n`;
    }
}