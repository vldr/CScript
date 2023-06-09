import Type from "../Types/Type";
import Expression from "./Expression";
import ExpressionResult from "./ExpressionResult";
import Variable from "../Variables/Variable";

export default class ExpressionResultAccessor extends ExpressionResult
{
    constructor(
        type: Type,
        expression: Expression,
        public readonly variable: Variable
    )
    {
        super(type, expression);
    }
}