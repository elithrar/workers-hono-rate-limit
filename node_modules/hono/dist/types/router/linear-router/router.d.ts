import type { Router, Result } from '../../router';
export declare class LinearRouter<T> implements Router<T> {
    name: string;
    routes: [string, string, T][];
    add(method: string, path: string, handler: T): void;
    match(method: string, path: string): Result<T>;
}
