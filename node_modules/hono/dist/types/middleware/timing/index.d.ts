import type { Context } from '../../context';
import type { MiddlewareHandler } from '../../types';
import '../../context';
declare module '../../context' {
    interface ContextVariableMap {
        metric?: {
            headers: string[];
            timers: Map<string, Timer>;
        };
    }
}
interface Timer {
    description?: string;
    start: number;
}
interface TimingOptions {
    total: boolean;
    enabled: boolean | ((c: Context) => boolean);
    totalDescription: string;
    autoEnd: boolean;
    crossOrigin: boolean | string;
}
export declare const timing: (config?: Partial<TimingOptions>) => MiddlewareHandler;
interface SetMetric {
    (c: Context, name: string, value: number, description?: string, precision?: number): void;
    (c: Context, name: string, description?: string): void;
}
export declare const setMetric: SetMetric;
export declare const startTime: (c: Context, name: string, description?: string) => void;
export declare const endTime: (c: Context, name: string, precision?: number) => void;
export {};
