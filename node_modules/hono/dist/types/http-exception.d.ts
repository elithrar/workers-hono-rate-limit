import type { StatusCode } from './utils/http-status';
type HTTPExceptionOptions = {
    res?: Response;
    message?: string;
};
export declare class HTTPException extends Error {
    readonly res?: Response;
    readonly status: StatusCode;
    constructor(status?: StatusCode, options?: HTTPExceptionOptions);
    getResponse(): Response;
}
export {};
