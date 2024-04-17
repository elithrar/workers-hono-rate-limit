import type { MiddlewareHandler } from '../../types';
export declare const basicAuth: (options: {
    username: string;
    password: string;
    realm?: string;
    hashFunction?: Function;
}, ...users: {
    username: string;
    password: string;
}[]) => MiddlewareHandler;
