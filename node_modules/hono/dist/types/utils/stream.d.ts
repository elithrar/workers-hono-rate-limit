export declare class StreamingApi {
    private writer;
    private encoder;
    private writable;
    private abortSubscribers;
    responseReadable: ReadableStream;
    constructor(writable: WritableStream, _readable: ReadableStream);
    write(input: Uint8Array | string): Promise<this>;
    writeln(input: string): Promise<this>;
    sleep(ms: number): Promise<unknown>;
    close(): Promise<void>;
    pipe(body: ReadableStream): Promise<void>;
    onAbort(listener: () => void | Promise<void>): Promise<void>;
}
