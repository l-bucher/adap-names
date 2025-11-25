export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    // @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        this.components = [...other];
        if (delimiter !== undefined) {
            this.assertIsValidDelimiter(delimiter);
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        this.assertIsValidDelimiter(delimiter);
        // unmask components
        const unmasked = this.components.map(comp => this.unmask(comp));
        return unmasked.join(delimiter);
    }

    /** removes escape characters */
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

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        // unmask, then remask for DEFAULT_DELIMITER
        const unmasked = this.components.map(c => this.unmask(c));
        const remasked = unmasked.map(c => this.mask(c, DEFAULT_DELIMITER));
        return remasked.join(DEFAULT_DELIMITER);
    }

    /** adds escape characters for special characters */
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

    /** Returns properly masked component string */
    // @methodtype get-method
    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.assertIsNotNullOrUndefined(c);
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     // @methodtype get-method
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents()) {
            throw new RangeError(`Insert index ${i} out of bounds [0, ${this.getNoComponents()}]`);
        }
        this.assertIsNotNullOrUndefined(c);
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
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

    // @methodtype assertion-method
    private assertIsValidDelimiter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new RangeError("Delimiter must be exactly one character");
        }
    }

}
