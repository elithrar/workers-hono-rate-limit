import type { Router, Result } from '../../router';
export declare class SmartRouter<T> implements Router<T> {
    name: string;
    routers: Router<T>[];
    routes?: [string, string, T][];
    constructor(init: Pick<SmartRouter<T>, 'routers'>);
    add(method: string, path: string, handler: T): void;
    match(method: string, path: string): Result<T>;
    get activeRouter(): Router<T>;
}
