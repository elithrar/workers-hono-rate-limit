import type { MiddlewareHandler } from '../../types';
import '../../context';
declare module '../../context' {
    interface ContextVariableMap {
        jwtPayload: any;
    }
}
export declare const jwt: (options: {
    secret: string;
    cookie?: string;
    alg?: string;
}) => MiddlewareHandler;
export declare const verify: (token: string, secret: string, alg?: "HS256" | "HS384" | "HS512") => Promise<any>;
export declare const decode: (token: string) => {
    header: any;
    payload: any;
};
export declare const sign: (payload: unknown, secret: string, alg?: "HS256" | "HS384" | "HS512") => Promise<string>;
