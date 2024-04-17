import type { Context } from '../../context';
import type { CookieOptions, Cookie, SignedCookie } from '../../utils/cookie';
interface GetCookie {
    (c: Context, key: string): string | undefined;
    (c: Context): Cookie;
}
interface GetSignedCookie {
    (c: Context, secret: string | BufferSource, key: string): Promise<string | undefined | false>;
    (c: Context, secret: string): Promise<SignedCookie>;
}
export declare const getCookie: GetCookie;
export declare const getSignedCookie: GetSignedCookie;
export declare const setCookie: (c: Context, name: string, value: string, opt?: CookieOptions) => void;
export declare const setSignedCookie: (c: Context, name: string, value: string, secret: string | BufferSource, opt?: CookieOptions) => Promise<void>;
export declare const deleteCookie: (c: Context, name: string, opt?: CookieOptions) => void;
export {};
