import type { KVNamespace } from '@cloudflare/workers-types';
export type KVAssetOptions = {
    manifest?: object | string;
    namespace?: KVNamespace;
};
export declare const getContentFromKVAsset: (path: string, options?: KVAssetOptions) => Promise<ArrayBuffer | null>;
