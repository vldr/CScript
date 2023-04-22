import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionSAVEB extends Instruction
{
    constructor(private _destinationVariable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `SAVEB ${this._destinationVariable.labelName}\n`;
    }
}