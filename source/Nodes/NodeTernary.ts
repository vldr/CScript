import Node from "./Node";

export default class NodeTernary extends Node
{
    public readonly condition: Node;
    public readonly is_true: Node;
    public readonly is_false: Node;
}