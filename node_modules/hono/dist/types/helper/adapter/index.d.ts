import type { Context } from '../../context';
export type Runtime = 'node' | 'deno' | 'bun' | 'workerd' | 'fastly' | 'edge-light' | 'lagon' | 'other';
export declare const env: <T extends Record<string, unknown>, C extends Context<any, any, {}> = Context<{}, any, {}>>(c: C, runtime?: Runtime) => T & C["env"];
export declare const getRuntimeKey: () => "other" | "node" | "deno" | "bun" | "workerd" | "fastly" | "edge-light" | "lagon";
