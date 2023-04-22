import Statement from "./Statement";
import NodeScope from "../Nodes/NodeScope";
import Scope from "../Scope";

export default class StatementScope extends Statement
{
    public generateAndEmit(): void
    {
        const node = this._node as NodeScope;

        const substatementIndex = this._scope.getNextSubstatementIndex();
        const statementName = `scope_${substatementIndex}`;

        const newScope = new Scope(this._compiler, "_" + statementName, this._scope);
        this._compiler.addScope(newScope);

        node.statements.forEach((statement) =>
        {
            this._compiler.generateAndEmitStatement(
                newScope,
                statement
            );
        });
    }
}