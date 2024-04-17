import type { HtmlEscapedString } from '../../utils/html';
type CssEscaped = {
    isCssEscaped: true;
};
type CssEscapedString = string & CssEscaped;
/**
 * @experimental
 * `rawCssString` is an experimental feature.
 * The API might be changed.
 */
export declare const rawCssString: (value: string) => CssEscapedString;
type CssVariableBasicType = string | String | number | boolean | null | undefined;
type CssVariableAsyncType = Promise<CssVariableBasicType>;
type CssVariableArrayType = (CssVariableBasicType | CssVariableAsyncType)[];
type CssVariableType = CssVariableBasicType | CssVariableAsyncType | CssVariableArrayType;
/**
 * @experimental
 * `createCssContext` is an experimental feature.
 * The API might be changed.
 */
export declare const createCssContext: ({ id }: {
    id: Readonly<string>;
}) => {
    css: (strings: TemplateStringsArray, ...values: CssVariableType[]) => Promise<string>;
    cx: (...args: (string | boolean | null | undefined | Promise<string | boolean | null | undefined>)[]) => Promise<string>;
    keyframes: (strings: TemplateStringsArray, ...values: CssVariableType[]) => Promise<String>;
    Style: () => HtmlEscapedString;
};
/**
 * @experimental
 * `css` is an experimental feature.
 * The API might be changed.
 */
export declare const css: (strings: TemplateStringsArray, ...values: CssVariableType[]) => Promise<string>;
/**
 * @experimental
 * `cx` is an experimental feature.
 * The API might be changed.
 */
export declare const cx: (...args: (string | boolean | null | undefined | Promise<string | boolean | null | undefined>)[]) => Promise<string>;
/**
 * @experimental
 * `keyframes` is an experimental feature.
 * The API might be changed.
 */
export declare const keyframes: (strings: TemplateStringsArray, ...values: CssVariableType[]) => Promise<String>;
/**
 * @experimental
 * `Style` is an experimental feature.
 * The API might be changed.
 */
export declare const Style: () => HtmlEscapedString;
export {};
