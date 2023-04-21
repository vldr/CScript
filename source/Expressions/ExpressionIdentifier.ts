import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import Type from "../Types/Type";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import ExternalErrors from "../Errors/ExternalErrors";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import DestinationVariable from "../Destinations/DestinationVariable";
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import DestinationStack from "../Destinations/DestinationStack";
import NodeIdentifier from "../Nodes/NodeIdentifier";
import InstructionMOV from "../Instructions/InstructionMOV";
import InstructionGETA from "../Instructions/InstructionGETA";
import InstructionGETB from "../Instructions/InstructionGETB";
import InstructionPUSH from "../Instructions/InstructionPUSH";
import DestinationNone from "../Destinations/DestinationNone";
import ExpressionResultVariable from "./ExpressionResultVariable";

export default class ExpressionIdentifier extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeIdentifier;
        const name = node.name;
        const destination = this._destination;

        const variable = this._scope.getVariableByName(name);

        if (variable === undefined)
            throw ExternalErrors.CANNOT_FIND_NAME(node, name);

        const expressionResult = new ExpressionResultVariable(variable.type, this, variable);

        if (destination instanceof DestinationNone)
            return expressionResult;

        if (destination instanceof DestinationVariable)
        {
            expressionResult.pushInstruction(new InstructionMOV(variable, destination.variable));
        }
        else if (destination instanceof DestinationRegisterA)
        {
            expressionResult.pushInstruction(new InstructionGETA(variable));
        }
        else if (destination instanceof DestinationRegisterB)
        {
            expressionResult.pushInstruction(new InstructionGETB(variable));
        }
        else if (destination instanceof DestinationStack)
        {
            expressionResult.pushInstruction(new InstructionPUSH(variable));
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }

    private isInlinable(type: Type, value: number): boolean
    {
        let result = false;

        if (type instanceof TypeInteger || type instanceof TypeUnsignedInteger)
        {
            if (Number.isInteger(value) && value >= 0 && value <= 4095)
            {
                result = true;
            }
        }

        return result;
    }

}