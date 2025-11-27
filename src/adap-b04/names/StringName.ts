import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    // @methodtype initialization-method
    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source != null, "source cannot be null or undefined");
        
        super(delimiter);
        this.name = source;
        this.noComponents = this.calculateNoComponents();
        
        this.assertClassInvariants();
    }

    // @methodtype cloning-method
    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `index ${i} out of bounds [0, ${this.getNoComponents()})`);
        
        const components = this.splitIntoComponents();
        const result = components[i];
        
        MethodFailedException.assert(result !== undefined, "failed to get component");
        this.assertClassInvariants();
        return result;
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `index ${i} out of bounds [0, ${this.getNoComponents()})`);
        IllegalArgumentException.assert(c != null, "component cannot be null or undefined");
        
        const components = this.splitIntoComponents();
        components[i] = c;
        this.name = components.join(this.delimiter);
        
        MethodFailedException.assert(this.getComponent(i) === c, "component not set correctly");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), `insert index ${i} out of bounds [0, ${this.getNoComponents()}]`);
        IllegalArgumentException.assert(c != null, "component cannot be null or undefined");
        
        const oldLength = this.getNoComponents();
        
        if (this.isEmpty()) {
            this.name = c;
        } else {
            const components = this.splitIntoComponents();
            components.splice(i, 0, c);
            this.name = components.join(this.delimiter);
        }
        this.noComponents++;
        
        MethodFailedException.assert(this.getNoComponents() === oldLength + 1, "insert did not increase length");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public append(c: string): void {
        IllegalArgumentException.assert(c != null, "component cannot be null or undefined");
        
        const oldLength = this.getNoComponents();
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
        
        MethodFailedException.assert(this.getNoComponents() === oldLength + 1, "append did not increase length");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public remove(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `index ${i} out of bounds [0, ${this.getNoComponents()})`);
        
        const oldLength = this.getNoComponents();
        
        if (this.getNoComponents() === 1) {
            this.name = "";
        } else {
            const components = this.splitIntoComponents();
            components.splice(i, 1);
            this.name = components.join(this.delimiter);
        }
        this.noComponents--;
        
        MethodFailedException.assert(this.getNoComponents() === oldLength - 1, "remove did not decrease length");
        this.assertClassInvariants();
    }

    // @methodtype helper-method
    private splitIntoComponents(): string[] {
        // Use regex to split only at delimiters that are not escaped (not preceded by \)
        const unescaped = new RegExp(`(?<!\\\\)\\${this.delimiter}`, "g");
        return this.name.split(unescaped);
    }

    // @methodtype helper-method
    // Note: Only used in constructor to initialize noComponents from the source string.
    // After construction, noComponents is maintained independently via ++/-- operations.
    private calculateNoComponents(): number {
        return this.splitIntoComponents().length;
    }

    // @methodtype assertion-method
    protected assertClassInvariants(): void {
        super.assertClassInvariants();
        InvalidStateException.assert(this.name != null, "name cannot be null or undefined");
        InvalidStateException.assert(this.noComponents >= 0, "noComponents must be non-negative");
    }

}