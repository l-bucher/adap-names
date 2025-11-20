import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    // @methodtype initialization-method
    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = [...source];
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
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c);
        this.components[i] = c;
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents()) {
            throw new RangeError(`Insert index ${i} out of bounds [0, ${this.getNoComponents()}]`);
        }
        this.assertIsNotNullOrUndefined(c);
        this.components.splice(i, 0, c);
    }

    // @methodtype command-method
    public append(c: string): void {
        this.assertIsNotNullOrUndefined(c);
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

}