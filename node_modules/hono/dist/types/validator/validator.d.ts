import type { Context } from '../context';
import type { Env, ValidationTargets, MiddlewareHandler, TypedResponse } from '../types';
type ValidationTargetKeysWithBody = 'form' | 'json';
type ValidationTargetByMethod<M> = M extends 'get' | 'head' ? Exclude<keyof ValidationTargets, ValidationTargetKeysWithBody> : keyof ValidationTargets;
export type ValidationFunction<InputType, OutputType, E extends Env = {}, P extends string = string> = (value: InputType, c: Context<E, P>) => OutputType | Response | Promise<OutputType> | Promise<Response>;
type ExcludeResponseType<T> = T extends Response & TypedResponse<any> ? never : T;
export declare const validator: <InputType, P extends string, M extends string, U extends ValidationTargetByMethod<M>, OutputType = ValidationTargets[U], P2 extends string = P, V extends {
    in: { [K in U]: unknown extends InputType ? OutputType : InputType; };
    out: { [K_1 in U]: ExcludeResponseType<OutputType>; };
} = {
    in: { [K_2 in U]: unknown extends InputType ? OutputType : InputType; };
    out: { [K_3 in U]: ExcludeResponseType<OutputType>; };
}, E extends Env = any>(target: U, validationFunc: ValidationFunction<unknown extends InputType ? ValidationTargets[U] : InputType, OutputType, E, P2>) => MiddlewareHandler<E, P, V>;
export {};
