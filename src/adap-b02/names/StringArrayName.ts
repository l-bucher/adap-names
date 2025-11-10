import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    // @methodtype initialization-method
    constructor(source: string[], delimiter?: string) {
        this.components = [...source];
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        // unmask components
        const unmasked = this.components.map(comp => this.unmask(comp));
        return unmasked.join(delimiter);
    }

    // @methodtype conversion-method
    public asDataString(): string {
        // unmask, then remask for DEFAULT_DELIMITER
        const unmasked = this.components.map(c => this.unmask(c));
        const remasked = unmasked.map(c => this.mask(c, DEFAULT_DELIMITER));
        return remasked.join(DEFAULT_DELIMITER);
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // @methodtype query-method
    public isEmpty(): boolean {
        return this.components.length === 0;
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

    // @methodtype command-method
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    // @methodtype helper-method
    private unmask(component: string): string {
        let result = '';
        let i = 0;

        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                // Found escape char + next char exists: take next char, skip both
                result += component[i + 1];
                i += 2;
            } else {
                // Normal char or escape at end: take current char, move forward
                result += component[i];
                i++;
            }
        }
        return result;
    }

    // @methodtype helper-method
    private mask(component: string, delimiter: string): string {
        let result = '';
        for (let i = 0; i < component.length; i++) {
            const char = component[i];
            // escape the delimiter and the escape character
            if (char === delimiter || char === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER;
            }
            result += char;
        }
        return result;
    }

    // @methodtype assertion-method
    private assertIsValidIndex(index: number): void {
        if (index < 0 || index >= this.getNoComponents()) {
            throw new RangeError(`Index ${index} out of bounds [0, ${this.getNoComponents()})`);
        }
    }

    // @methodtype assertion-method
    private assertIsNotNullOrUndefined(component: string): void {
        if (component === null || component === undefined) {
            throw new TypeError("Component cannot be null or undefined");
        }
    }

}