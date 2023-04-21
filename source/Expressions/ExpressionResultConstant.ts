import Type from "../Types/Type";
import Expression from "./Expression";
import ExpressionResult from "./ExpressionResult";

export default class ExpressionResultConstant extends ExpressionResult
{
    constructor(
        type: Type,
        expression: Expression,
        public readonly value: number
    )
    {
        super(type, expression)
    }
}