export type Cookie = Record<string, string>;
export type SignedCookie = Record<string, string | false>;
export type CookieOptions = {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    secure?: boolean;
    signingSecret?: string;
    sameSite?: 'Strict' | 'Lax' | 'None';
    partitioned?: boolean;
};
export declare const parse: (cookie: string, name?: string) => Cookie;
export declare const parseSigned: (cookie: string, secret: string | BufferSource, name?: string) => Promise<SignedCookie>;
export declare const serialize: (name: string, value: string, opt?: CookieOptions) => string;
export declare const serializeSigned: (name: string, value: string, secret: string | BufferSource, opt?: CookieOptions) => Promise<string>;
