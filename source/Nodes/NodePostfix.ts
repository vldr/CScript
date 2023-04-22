import Node from "./Node";

export default class NodePostfix extends Node
{
    public readonly operator: Node;
    public readonly expression: Node;
}