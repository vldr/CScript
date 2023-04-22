import Instruction from "./Instruction";
import Function from "../Function"

export default class InstructionCALL extends Instruction
{
    constructor(private _destinationFunction: Function)
    {
        super();
    }

    public write(): string
    {
        return `CALL ${this._destinationFunction.labelName}\n`;
    }
}