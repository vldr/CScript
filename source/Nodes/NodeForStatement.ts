import Node from "./Node";

export default class NodeForStatement extends Node
{
    public readonly initializer: Node;
    public readonly condition: Node | null;
    public readonly increment: Node | null;
    public readonly body: Node;
}