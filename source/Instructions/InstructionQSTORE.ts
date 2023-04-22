import Instruction from "./Instruction";
import Variable from "../Variables/Variable";

export default class InstructionQSTORE extends Instruction
{
    constructor(
        private _value: string,
        private _destinationVariable: Variable
    )
    {
        super();
    }

    public write(): string
    {
        return `QSTORE ${this._value} ${this._destinationVariable.labelName}\n`;
    }
}