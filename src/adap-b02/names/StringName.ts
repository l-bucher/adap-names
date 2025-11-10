import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    // @methodtype initialization-method
    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.name = source;
        this.noComponents = this.calculateNoComponents();
    }

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        if (delimiter === this.delimiter) {
            // unmask the name string
            return this.unmask(this.name);
        } else {
            // need to split, unmask, and rejoin with different delimiter
            const components = this.splitIntoComponents();
            const unmasked = components.map(c => this.unmask(c));
            return unmasked.join(delimiter);
        }
    }

    // @methodtype conversion-method
    public asDataString(): string {
        if (this.delimiter === DEFAULT_DELIMITER) {
            return this.name;
        } else {
            // need to unmask, remask for DEFAULT_DELIMITER, and rejoin
            const components = this.splitIntoComponents();
            const unmasked = components.map(c => this.unmask(c));
            const remasked = unmasked.map(c => this.mask(c, DEFAULT_DELIMITER));
            return remasked.join(DEFAULT_DELIMITER);
        }
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // @methodtype query-method
    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(x: number): string {
        const components = this.splitIntoComponents();
        return components[x];
    }

    // @methodtype set-method
    public setComponent(n: number, c: string): void {
        const components = this.splitIntoComponents();
        const wasExtended = n >= components.length;
        components[n] = c;
        this.name = components.join(this.delimiter);
        if (wasExtended) {
            this.noComponents = components.length;
        }
    }

    // @methodtype command-method
    public insert(n: number, c: string): void {
        const components = this.splitIntoComponents();
        components.splice(n, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    // @methodtype command-method
    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    // @methodtype command-method
    public remove(n: number): void {
        const components = this.splitIntoComponents();
        const removed = components.splice(n, 1);
        if (removed.length > 0) {
            this.name = components.join(this.delimiter);
            this.noComponents--;
        }
    }

    // @methodtype command-method
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
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

}