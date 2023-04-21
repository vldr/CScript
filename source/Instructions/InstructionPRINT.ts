import Instruction from "./Instruction";
import DestinationVariable from "../Destinations/DestinationVariable";
import Type from "../Types/Type";
import InternalErrors from "../Errors/InternalErrors";
import TypeFloat from "../Types/TypeFloat";
import TypeInteger from "../Types/TypeInteger";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";

export default class InstructionPrint extends Instruction
{
    constructor(public readonly labelName: string, public readonly name: string)
    {
        super();
    }

    public write(): string
    {
        return `PRINT ${this.labelName} ${this.name}\n`;
    }
}