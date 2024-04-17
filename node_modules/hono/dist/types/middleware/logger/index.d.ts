import type { MiddlewareHandler } from '../../types';
type PrintFunc = (str: string, ...rest: string[]) => void;
export declare const logger: (fn?: PrintFunc) => MiddlewareHandler;
export {};
