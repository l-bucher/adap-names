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
        
        const components = this.splitIntoComponents();
        for (const c of components) {
            this.assertIsProperlyMasked(c);
        }
        this.noComponents = components.length;
        
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
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `index ${i} out of bounds [0, ${this.getNoComponents()})`);
        IllegalArgumentException.assert(c != null, "component cannot be null or undefined");
        this.assertIsProperlyMasked(c);
        
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
        this.assertIsProperlyMasked(c);
        
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
        this.assertIsProperlyMasked(c);
        
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
        const parts = this.name.split(this.delimiter);

        for (let i = 0; i < parts.length - 1; i++) {
            // Count trailing escape characters to check for escape
            let backslashCount = 0;
            for (let j = parts[i].length - 1; j >= 0; j--) {
                if (parts[i][j] === ESCAPE_CHARACTER) {
                    backslashCount++;
                } else {
                    break;
                }
            }

            // If odd number of escape characters, the delimiter was escaped
            if (backslashCount % 2 !== 0) {
                parts[i] += this.delimiter + parts[i+1]; // Merge with next part
                parts.splice(i+1, 1); // Remove the next part
                i--; // Check current index again
            }
        }
        return parts;
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