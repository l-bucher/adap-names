import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    // @methodtype initialization-method
    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsValidDelimiter(delimiter);
        this.delimiter = delimiter;
    }

    abstract clone(): Name;

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        this.assertIsValidDelimiter(delimiter);
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const unmasked = components.map(c => this.unmask(c));
        return unmasked.join(delimiter);
    }

    // @methodtype conversion-method
    public toString(): string {
        return this.asDataString();
    }

    // @methodtype conversion-method
    public asDataString(): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const unmasked = components.map(c => this.unmask(c));
        const remasked = unmasked.map(c => this.mask(c, DEFAULT_DELIMITER));
        return remasked.join(DEFAULT_DELIMITER);
    }

    // @methodtype boolean-query-method
    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    // @methodtype get-method
    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    // @methodtype boolean-query-method
    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    // @methodtype command-method
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    // @methodtype helper-method
    protected unmask(component: string): string {
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
    protected mask(component: string, delimiter: string): string {
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
    protected assertIsValidIndex(index: number): void {
        if (index < 0 || index >= this.getNoComponents()) {
            throw new RangeError(`Index ${index} out of bounds [0, ${this.getNoComponents()})`);
        }
    }

    // @methodtype assertion-method
    protected assertIsNotNullOrUndefined(component: string): void {
        if (component === null || component === undefined) {
            throw new TypeError("Component cannot be null or undefined");
        }
    }

    // @methodtype assertion-method
    protected assertIsValidDelimiter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new RangeError("Delimiter must be exactly one character");
        }
    }
}