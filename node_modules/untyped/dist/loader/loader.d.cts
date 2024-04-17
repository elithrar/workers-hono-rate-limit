import { JITIOptions } from 'jiti';
import { S as Schema } from '../shared/untyped.a47b2336.cjs';

interface LoaderOptions {
    jiti?: JITIOptions;
    defaults?: Record<string, any>;
    ignoreDefaults?: boolean;
}
declare function loadSchema(entryPath: string, options?: LoaderOptions): Promise<Schema>;

export { type LoaderOptions, loadSchema };
