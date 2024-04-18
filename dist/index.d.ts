import * as hono from 'hono';
import { Context } from 'hono';

interface RateLimitBinding {
    limit: LimitFunc;
}
interface LimitFunc {
    (options: LimitOptions): Promise<RateLimitResult>;
}
interface RateLimitResult {
    success: boolean;
}
interface LimitOptions {
    key: string;
}
interface RateLimitResponse {
    key: string;
    success: boolean;
}
interface RateLimitOptions {
    continueOnRateLimit: boolean;
}
type RateLimitKeyFunc = {
    (c: Context): string;
};
declare const rateLimit: (rateLimitBinding: RateLimitBinding, keyFunc: RateLimitKeyFunc, options?: RateLimitOptions) => hono.MiddlewareHandler<any, any, {}>;
declare const wasRateLimited: (c: Context) => boolean;

export { type LimitFunc, type LimitOptions, type RateLimitBinding, type RateLimitKeyFunc, type RateLimitOptions, type RateLimitResponse, rateLimit, wasRateLimited };
