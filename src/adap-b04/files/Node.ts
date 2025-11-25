import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        // Preconditions
        IllegalArgumentException.assert(bn != null, "base name cannot be null or undefined");
        // Special case: RootNode is allowed to have empty base name
        if (this.constructor.name !== "RootNode") {
            IllegalArgumentException.assert(bn.length > 0, "base name cannot be empty");
        }
        IllegalArgumentException.assert(pn != null, "parent node cannot be null or undefined");
        
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to != null, "target directory cannot be null or undefined");
        
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn != null, "base name cannot be null or undefined");
        IllegalArgumentException.assert(bn.length > 0, "base name cannot be empty");
        
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

}
