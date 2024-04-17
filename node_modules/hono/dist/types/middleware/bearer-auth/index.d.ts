import type { MiddlewareHandler } from '../../types';
export declare const bearerAuth: (options: {
    token: string | string[];
    realm?: string;
    prefix?: string;
    hashFunction?: Function;
}) => MiddlewareHandler;
