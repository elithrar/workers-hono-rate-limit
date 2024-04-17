import type { StringBuffer, HtmlEscaped, HtmlEscapedString } from '../utils/html';
import type { IntrinsicElements as IntrinsicElementsDefined } from './intrinsic-elements';
export { ErrorBoundary } from './components';
type Props = Record<string, any>;
declare global {
    namespace JSX {
        type Element = HtmlEscapedString | Promise<HtmlEscapedString>;
        interface ElementChildrenAttribute {
            children: Child;
        }
        interface IntrinsicElements extends IntrinsicElementsDefined {
            [tagName: string]: Props;
        }
    }
}
type LocalContexts = [Context<unknown>, unknown][];
export type Child = string | Promise<string> | number | JSXNode | Child[];
export declare class JSXNode implements HtmlEscaped {
    tag: string | Function;
    props: Props;
    children: Child[];
    isEscaped: true;
    localContexts?: LocalContexts;
    constructor(tag: string | Function, props: Props, children: Child[]);
    toString(): string | Promise<string>;
    toStringToBuffer(buffer: StringBuffer): void;
}
export { jsxFn as jsx };
declare const jsxFn: (tag: string | Function, props: Props, ...children: (string | HtmlEscapedString)[]) => JSXNode;
export type FC<T = Props> = (props: T & {
    children?: Child;
}) => HtmlEscapedString | Promise<HtmlEscapedString>;
export declare const memo: <T>(component: FC<T>, propsAreEqual?: (prevProps: Readonly<T>, nextProps: Readonly<T>) => boolean) => FC<T>;
export declare const Fragment: (props: {
    key?: string;
    children?: Child | HtmlEscapedString;
}) => HtmlEscapedString;
export interface Context<T> {
    values: T[];
    Provider: FC<{
        value: T;
    }>;
}
export declare const createContext: <T>(defaultValue: T) => Context<T>;
export declare const useContext: <T>(context: Context<T>) => T;
