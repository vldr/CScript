import Node from "./Node";

export default class NodeExpression extends Node
{
    public readonly expression: Node | null;
}