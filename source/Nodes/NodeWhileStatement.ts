import Node from "./Node";

export default class NodeWhileStatement extends Node
{
    public readonly condition: Node;
    public readonly body: Node;
}