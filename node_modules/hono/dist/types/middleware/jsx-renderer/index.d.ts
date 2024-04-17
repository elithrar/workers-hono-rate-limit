import type { Context, Renderer } from '../../context';
import type { FC } from '../../jsx';
import type { Env, Input, MiddlewareHandler } from '../../types';
export declare const RequestContext: import("../../jsx").Context<Context<any, any, {}> | null>;
type PropsForRenderer = [...Required<Parameters<Renderer>>] extends [unknown, infer Props] ? Props : unknown;
type RendererOptions = {
    docType?: boolean | string;
    stream?: boolean | Record<string, string>;
};
export declare const jsxRenderer: (component?: FC<PropsForRenderer>, options?: RendererOptions) => MiddlewareHandler;
export declare const useRequestContext: <E extends Env = any, P extends string = any, I extends Input = {}>() => Context<E, P, I>;
export {};
