import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.state !== FileState.OPEN, "cannot open an already open file");
        IllegalArgumentException.assert(this.state !== FileState.DELETED, "cannot open a deleted file");
        
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(this.state === FileState.OPEN, "file must be open to read it");
        IllegalArgumentException.assert(noBytes >= 0, "number of bytes must be non-negative");
        
        const result = new Int8Array(noBytes);
        return result;
    }

    public close(): void {
        IllegalArgumentException.assert(this.state !== FileState.CLOSED, "cannot close an already closed file");
        IllegalArgumentException.assert(this.state !== FileState.DELETED, "cannot close a deleted file");
        
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}