import { type HtmlEscapedString } from '../utils/html';
import type { FC, Child } from './index';
export declare const childrenToString: (children: Child[]) => Promise<HtmlEscapedString[]>;
type ErrorHandler = (error: Error) => void;
type FallbackRender = (error: Error) => Child;
/**
 * @experimental
 * `ErrorBoundary` is an experimental feature.
 * The API might be changed.
 */
export declare const ErrorBoundary: FC<{
    fallback?: Child;
    fallbackRender?: FallbackRender;
    onError?: ErrorHandler;
}>;
export {};
