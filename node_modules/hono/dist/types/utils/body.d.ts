import type { HonoRequest } from '../request';
export type BodyData = Record<string, string | File | (string | File)[]>;
export type ParseBodyOptions = {
    /**
     * Parse all fields with multiple values should be parsed as an array.
     * @default false
     * @example
     * ```ts
     * const data = new FormData()
     * data.append('file', 'aaa')
     * data.append('file', 'bbb')
     * data.append('message', 'hello')
     * ```
     *
     * If `all` is `false`:
     * parseBody should return `{ file: 'bbb', message: 'hello' }`
     *
     * If `all` is `true`:
     * parseBody should return `{ file: ['aaa', 'bbb'], message: 'hello' }`
     */
    all?: boolean;
};
export declare const parseBody: <T extends BodyData = BodyData>(request: HonoRequest | Request, options?: ParseBodyOptions) => Promise<T>;
