import type { MiddlewareHandler } from '../../types';
type prettyOptions = {
    space: number;
};
export declare const prettyJSON: (options?: prettyOptions) => MiddlewareHandler;
export {};
