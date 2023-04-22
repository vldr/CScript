import Node from "./Node";

export default class NodeDoStatement extends Node
{
    public readonly condition: Node;
    public readonly body: Node;
}