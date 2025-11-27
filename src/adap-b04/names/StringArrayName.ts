import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    // @methodtype initialization-method
    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(source != null, "source cannot be null or undefined");
        
        super(delimiter);
        this.components = [...source];
        
        this.assertClassInvariants();
    }

    // @methodtype cloning-method
    public clone(): Name {
        return new StringArrayName(this.components, this.delimiter);
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `index ${i} out of bounds [0, ${this.getNoComponents()})`);
        
        const result = this.components[i];
        
        MethodFailedException.assert(result !== undefined, "failed to get component");
        this.assertClassInvariants();
        return result;
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `index ${i} out of bounds [0, ${this.getNoComponents()})`);
        IllegalArgumentException.assert(c != null, "component cannot be null or undefined");
        
        this.components[i] = c;
        
        MethodFailedException.assert(this.components[i] === c, "component not set correctly");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), `insert index ${i} out of bounds [0, ${this.getNoComponents()}]`);
        IllegalArgumentException.assert(c != null, "component cannot be null or undefined");
        
        const oldLength = this.getNoComponents();
        this.components.splice(i, 0, c);
        
        MethodFailedException.assert(this.getNoComponents() === oldLength + 1, "insert did not increase length");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public append(c: string): void {
        IllegalArgumentException.assert(c != null, "component cannot be null or undefined");
        
        const oldLength = this.getNoComponents();
        this.components.push(c);
        
        MethodFailedException.assert(this.getNoComponents() === oldLength + 1, "append did not increase length");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public remove(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `index ${i} out of bounds [0, ${this.getNoComponents()})`);
        
        const oldLength = this.getNoComponents();
        this.components.splice(i, 1);
        
        MethodFailedException.assert(this.getNoComponents() === oldLength - 1, "remove did not decrease length");
        this.assertClassInvariants();
    }

    // @methodtype assertion-method
    protected assertClassInvariants(): void {
        super.assertClassInvariants();
        InvalidStateException.assert(this.components != null, "components cannot be null or undefined");
    }

}