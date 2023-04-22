import Statement from "./Statement";
import ExternalErrors from "../Errors/ExternalErrors";
import NodeReturn from "../Nodes/NodeReturn";
import TypeVoid from "../Types/TypeVoid";
import DestinationStack from "../Destinations/DestinationStack";
import InstructionRTN from "../Instructions/InstructionRTN";

export default class StatementReturn extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeReturn;
        const value = node.value;

        const functionScope = this._scope.getFunction();

        if (functionScope === undefined)
        {
            throw ExternalErrors.RETURN_MUST_BE_IN_FUNCTION(node);
        }

        const returnType = functionScope.returnType;

        if (value)
        {
            const expressionResult = this._compiler.generateExpression(new DestinationStack(returnType), this._scope, value);

            if (!expressionResult.type.equals(returnType))
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(value, returnType.toString(), expressionResult.type.toString());
            }

            this._compiler.emitToFunctions(expressionResult.write());
        }
        else
        {
            if (!(returnType instanceof TypeVoid))
            {
                throw ExternalErrors.RETURN_EXPECTING_NON_VOID_VALUE(node);
            }
        }

        this._compiler.emitToFunctions(new InstructionRTN().write());
    }
}