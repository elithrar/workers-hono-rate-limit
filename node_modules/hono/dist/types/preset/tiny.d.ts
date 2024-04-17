import { HonoBase } from '../hono-base';
import type { HonoOptions } from '../hono-base';
import type { Env, Schema } from '../types';
export declare class Hono<E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'> extends HonoBase<E, S, BasePath> {
    constructor(options?: HonoOptions<E>);
}
