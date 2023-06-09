import Expression from "./Expression";
import TypeInteger from "../Types/TypeInteger";
import ExpressionResult from "./ExpressionResult";
import InternalErrors from "../Errors/InternalErrors";
import TypeUnsignedInteger from "../Types/TypeUnsignedInteger";
import DestinationRegisterA from "../Destinations/DestinationRegisterA";
import DestinationRegisterB from "../Destinations/DestinationRegisterB";
import DestinationVariable from "../Destinations/DestinationVariable";
import DestinationStack from "../Destinations/DestinationStack";
import DestinationNone from "../Destinations/DestinationNone";
import InstructionSAVE from "../Instructions/InstructionSAVE";
import InstructionSAVETOA from "../Instructions/InstructionSAVETOA";
import InstructionSAVETOB from "../Instructions/InstructionSAVETOB";
import InstructionSAVEPUSH from "../Instructions/InstructionSAVEPUSH";
import InstructionGETPOPB from "../Instructions/InstructionGETPOPB";
import InstructionGETPOPA from "../Instructions/InstructionGETPOPA";
import TypeFloat from "../Types/TypeFloat";
import ExternalErrors from "../Errors/ExternalErrors";
import TypeVoid from "../Types/TypeVoid";
import QualifierNone from "../Qualifiers/QualifierNone";
import NodeFunctionCall from "../Nodes/NodeFunctionCall";
import InstructionPOP from "../Instructions/InstructionPOP";
import InstructionCALL from "../Instructions/InstructionCALL";
import InstructionPOPNOP from "../Instructions/InstructionPOPNOP";
import InstructionRAND from "../Instructions/InstructionRAND";
import InstructionTICK from "../Instructions/InstructionTICK";
import SymbolFunction from "../Symbols/SymbolFunction";
import InstructionPRINT from "../Instructions/InstructionPRINT";
import NodeString from "../Nodes/NodeString";
import InstructionPUSH from "../Instructions/InstructionPUSH";
import InstructionSAVEPUSHA from "../Instructions/InstructionSAVEPUSHA";
import InstructionSAVEPUSHB from "../Instructions/InstructionSAVEPUSHB";
import InstructionSAVEFRONT from "../Instructions/InstructionSAVEFRONT";
import ExternalWarnings from "../Errors/ExternalWarnings";

export default class ExpressionFunctionCall extends Expression
{
    generate(): ExpressionResult
    {
        const node = this._node as NodeFunctionCall;
        const functionName = node.function_name;
        const nodeParameters = node.parameters;
        const functionIdentifier = node.identifier;

        if (functionName === "_urand")
        {
            return this.generateURandIntrinsic(node);
        }
        else if (functionName === "_tick")
        {
            return this.generateTickIntrinsic(node);
        }
        else if (functionName === "_println")
        {
            return this.generatePrintIntrinsic(node, true);
        }
        else if (functionName === "_print")
        {
            return this.generatePrintIntrinsic(node);
        }

        const fn = this._scope.getFunctionByName(functionName);

        if (fn === undefined)
        {
            throw ExternalErrors.CANNOT_FIND_NAME(node, functionName);
        }

        const fnParameters = fn.parameters;
        const fnReturnType = fn.returnType;

        const destination = this._destination;

        this._compiler.addSymbol(new SymbolFunction(functionIdentifier.location));

        ////////////////////////////////////////////////////////////

        if (fnParameters.length !== nodeParameters.length)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, fnParameters.length, nodeParameters.length);
        }

        const expressionResult = new ExpressionResult(fnReturnType, this);
        const scopeVariables = this._scope.getVariablesInFunction();

        const isVoidType = !(fnReturnType instanceof TypeVoid);
        const isRecursive = this._scope.getFunction()?.name === functionName;

        expressionResult.pushInstruction(new InstructionSAVEPUSHA());
        expressionResult.pushInstruction(new InstructionSAVEPUSHB());

        if (isRecursive)
        {
            for (const variable of scopeVariables) 
            {
                if (
                    (
                        variable.type instanceof TypeInteger ||
                        variable.type instanceof TypeUnsignedInteger ||
                        variable.type instanceof TypeFloat
                    )
                    && variable.type.arraySize <= 0
                )
                {
                    expressionResult.pushInstruction(new InstructionPUSH(variable));
                }
                else
                {
                    ExternalWarnings.STRUCT_OR_ARRAY_WONT_RECURSE(node, this._compiler, variable.name);
                }
            }
        }

        fnParameters.forEach((parameter, index) =>
        {
            const targetExpressionResult = this._compiler.generateExpression(
                new DestinationVariable(parameter.type, parameter), this._scope, nodeParameters[index]
            );

            if (!targetExpressionResult.type.equals(parameter.type))
            {
                throw ExternalErrors.CANNOT_CONVERT_TYPE(node, targetExpressionResult.type.toString(), parameter.type.toString());
            }

            expressionResult.pushExpressionResult(targetExpressionResult);
        });

        ////////////////////////////////////////////////////////////

        expressionResult.pushInstruction(new InstructionCALL(fn));

        if (isRecursive)
        {
            for (const variable of scopeVariables.reverse()) 
            {
                if (
                    (
                        variable.type instanceof TypeInteger ||
                        variable.type instanceof TypeUnsignedInteger ||
                        variable.type instanceof TypeFloat
                    )
                    && variable.type.arraySize <= 0
                )
                {
                    if (isVoidType) { expressionResult.pushInstruction(new InstructionSAVEFRONT(1)); }
                    expressionResult.pushInstruction(new InstructionPOP(variable));
                }
            }
        }
        
        if (isVoidType) { expressionResult.pushInstruction(new InstructionSAVEFRONT(1)); }
        expressionResult.pushInstruction(new InstructionGETPOPB());

        if (isVoidType) { expressionResult.pushInstruction(new InstructionSAVEFRONT(1)); }
        expressionResult.pushInstruction(new InstructionGETPOPA());

        if (destination instanceof DestinationVariable)
        {
            expressionResult.pushInstruction(new InstructionPOP(destination.variable));
        }
        else if (destination instanceof DestinationRegisterA)
        {
            expressionResult.pushInstruction(new InstructionGETPOPA());
        }
        else if (destination instanceof DestinationRegisterB)
        {
            expressionResult.pushInstruction(new InstructionGETPOPB());
        }
        else if (destination instanceof DestinationStack)
        {
        }
        else if (destination instanceof DestinationNone)
        {
            if (!(fnReturnType instanceof TypeVoid))
            {
                expressionResult.pushInstruction(new InstructionPOPNOP());
            }
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }

    private generatePrintIntrinsic(node: NodeFunctionCall, newline = false): ExpressionResult
    {
        const returnType = new TypeVoid(new QualifierNone(), 0);
        const expressionResult = new ExpressionResult(returnType, this);

        for (let nodeParameter of node.parameters)
        {
            if (nodeParameter.type === "string")
            {
                expressionResult.pushInstruction(new InstructionPRINT((nodeParameter as NodeString).value));
            }
            else
            {
                const targetExpressionResult = this._compiler.generateExpression(
                    new DestinationStack(returnType), this._scope, nodeParameter
                );  
        
                if (
                    (
                        targetExpressionResult.type instanceof TypeInteger ||
                        targetExpressionResult.type instanceof TypeUnsignedInteger ||
                        targetExpressionResult.type instanceof TypeFloat
                    )
                    && targetExpressionResult.type.arraySize <= 0
                )
                {
                    expressionResult.pushExpressionResult(targetExpressionResult);
                    expressionResult.pushInstruction(new InstructionPRINT(undefined));
                }
                else
                {
                    throw ExternalErrors.UNSUPPORTED_TYPE_FOR_PRINT(node, targetExpressionResult.type.toString());
                }
            }
        }

        if (newline)
        {
            expressionResult.pushInstruction(new InstructionPRINT("\n"));
        }

        return expressionResult;
    }

    private generateTickIntrinsic(node: NodeFunctionCall): ExpressionResult
    {
        const functionName = node.function_name;
        const nodeParameters = node.parameters;

        const destination = this._destination;

        const expectedParameters = 0;

        if (nodeParameters.length !== expectedParameters)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, expectedParameters, nodeParameters.length);
        }

        //////////////////////////////////////////////////////////////////

        const expressionResult = new ExpressionResult(new TypeUnsignedInteger(new QualifierNone(), 0), this);
        expressionResult.pushInstruction(new InstructionTICK());

        if (destination instanceof DestinationVariable)
        {
            expressionResult.pushInstruction(new InstructionSAVE(destination.variable));
        }
        else if (destination instanceof DestinationRegisterA)
        {
            expressionResult.pushInstruction(new InstructionSAVETOA());
        }
        else if (destination instanceof DestinationRegisterB)
        {
            expressionResult.pushInstruction(new InstructionSAVETOB());
        }
        else if (destination instanceof DestinationStack)
        {
            expressionResult.pushInstruction(new InstructionSAVEPUSH());
        }
        else if (destination instanceof DestinationNone)
        {
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }

    private generateURandIntrinsic(node: NodeFunctionCall): ExpressionResult
    {
        const functionName = node.function_name;
        const nodeParameters = node.parameters;

        const destination = this._destination;

        const expectedParameters = 0;

        if (nodeParameters.length !== expectedParameters)
        {
            throw ExternalErrors.PARAMETER_MISSING(node, functionName, expectedParameters, nodeParameters.length);
        }

        //////////////////////////////////////////////////////////////////

        const expressionResult = new ExpressionResult(new TypeUnsignedInteger(new QualifierNone(), 0), this);
        expressionResult.pushInstruction(new InstructionRAND());

        if (destination instanceof DestinationVariable)
        {
            expressionResult.pushInstruction(new InstructionSAVE(destination.variable));
        }
        else if (destination instanceof DestinationRegisterA)
        {
            expressionResult.pushInstruction(new InstructionSAVETOA());
        }
        else if (destination instanceof DestinationRegisterB)
        {
            expressionResult.pushInstruction(new InstructionSAVETOB());
        }
        else if (destination instanceof DestinationStack)
        {
            expressionResult.pushInstruction(new InstructionSAVEPUSH());
        }
        else if (destination instanceof DestinationNone)
        {
        }
        else
        {
            throw InternalErrors.generateError(`Unknown destination type, ${destination.constructor}.`);
        }

        return expressionResult;
    }
}