import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    // @methodtype initialization-method
    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.calculateNoComponents();
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
        this.assertIsValidIndex(i);
        const components = this.splitIntoComponents();
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c);
        const components = this.splitIntoComponents();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents()) {
            throw new RangeError(`Insert index ${i} out of bounds [0, ${this.getNoComponents()}]`);
        }
        this.assertIsNotNullOrUndefined(c);
        
        // Handle empty name edge case: "".split() returns [""], not []
        if (this.isEmpty()) {
            this.name = c;
        } else {
            const components = this.splitIntoComponents();
            components.splice(i, 0, c);
            this.name = components.join(this.delimiter);
        }
        this.noComponents++;
    }

    // @methodtype command-method
    public append(c: string): void {
        this.assertIsNotNullOrUndefined(c);
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertIsValidIndex(i);
        const components = this.splitIntoComponents();
        const removed = components.splice(i, 1);
        if (removed.length > 0) {
            this.name = components.join(this.delimiter);
            this.noComponents--;
        }
    }

    // @methodtype helper-method
    private splitIntoComponents(): string[] {
        // Use regex to split only at delimiters that are not escaped (not preceded by \)
        const unescaped = new RegExp(`(?<!\\\\)\\${this.delimiter}`, "g");
        return this.name.split(unescaped);
    }

    // @methodtype helper-method
    private calculateNoComponents(): number {
        return this.splitIntoComponents().length;
    }

}