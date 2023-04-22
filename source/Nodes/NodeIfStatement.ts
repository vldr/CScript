import Node from "./Node";

export default class NodeIfStatement extends Node
{
    public readonly condition: Node;
    public readonly body: Node;
    public readonly elseBody?: Node;
}