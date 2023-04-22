import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionSAVEA extends Instruction
{
    constructor(private _destinationVariable: Variable)
    {
        super();
    }

    public write(): string
    {
        return `SAVEA ${this._destinationVariable.labelName}\n`;
    }
}