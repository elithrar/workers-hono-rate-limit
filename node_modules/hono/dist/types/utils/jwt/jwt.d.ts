import type { AlgorithmTypes } from './types';
type AlgorithmTypeName = keyof typeof AlgorithmTypes;
export declare const sign: (payload: unknown, secret: string, alg?: AlgorithmTypeName) => Promise<string>;
export declare const verify: (token: string, secret: string, alg?: AlgorithmTypeName) => Promise<any>;
export declare const decode: (token: string) => {
    header: any;
    payload: any;
};
export {};
