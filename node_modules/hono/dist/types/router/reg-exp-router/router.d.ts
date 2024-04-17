import type { Router, Result } from '../../router';
type HandlerWithMetadata<T> = [T, number];
export declare class RegExpRouter<T> implements Router<T> {
    name: string;
    middleware?: Record<string, Record<string, HandlerWithMetadata<T>[]>>;
    routes?: Record<string, Record<string, HandlerWithMetadata<T>[]>>;
    constructor();
    add(method: string, path: string, handler: T): void;
    match(method: string, path: string): Result<T>;
    private buildAllMatchers;
    private buildMatcher;
}
export {};
