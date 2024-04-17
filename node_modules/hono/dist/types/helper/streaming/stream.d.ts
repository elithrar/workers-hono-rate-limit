import type { Context } from '../../context';
import { StreamingApi } from '../../utils/stream';
export declare const stream: (c: Context, cb: (stream: StreamingApi) => Promise<void>) => Response;
