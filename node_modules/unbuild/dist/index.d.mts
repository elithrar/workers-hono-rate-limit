import { PackageJson } from 'pkg-types';
import { Hookable } from 'hookable';
import { OutputOptions, RollupOptions, RollupBuild } from 'rollup';
import { MkdistOptions } from 'mkdist';
import { Schema } from 'untyped';
import { RollupReplaceOptions } from '@rollup/plugin-replace';
import { RollupAliasOptions } from '@rollup/plugin-alias';
import { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';
import { RollupJsonOptions } from '@rollup/plugin-json';
import { Options } from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';
import { JITIOptions } from 'jiti';
import { CommonOptions, Loader } from 'esbuild';
import { FilterPattern } from '@rollup/pluginutils';

type EsbuildOptions = CommonOptions & {
    include?: FilterPattern;
    exclude?: FilterPattern;
    /**
     * Map extension to esbuild loader
     * Note that each entry (the extension) needs to start with a dot
     */
    loaders?: {
        [ext: string]: Loader | false;
    };
};

type RollupCommonJSOptions = Parameters<typeof commonjs>[0] & {};
interface BaseBuildEntry {
    builder?: "untyped" | "rollup" | "mkdist";
    input: string;
    name?: string;
    outDir?: string;
    declaration?: "compatible" | "node16" | boolean;
}
interface UntypedBuildEntry extends BaseBuildEntry {
    builder: "untyped";
    defaults?: Record<string, any>;
}
interface RollupBuildEntry extends BaseBuildEntry {
    builder: "rollup";
}
type _BaseAndMkdist = BaseBuildEntry & MkdistOptions;
interface MkdistBuildEntry extends _BaseAndMkdist {
    builder: "mkdist";
}
type BuildEntry = BaseBuildEntry | RollupBuildEntry | UntypedBuildEntry | MkdistBuildEntry;
interface RollupBuildOptions {
    emitCJS?: boolean;
    cjsBridge?: boolean;
    inlineDependencies?: boolean;
    output?: OutputOptions;
    replace: RollupReplaceOptions | false;
    alias: RollupAliasOptions | false;
    resolve: RollupNodeResolveOptions | false;
    json: RollupJsonOptions | false;
    esbuild: EsbuildOptions | false;
    commonjs: RollupCommonJSOptions | false;
    dts: Options;
}
interface BuildOptions {
    name: string;
    rootDir: string;
    entries: BuildEntry[];
    clean: boolean;
    /** @experimental */
    sourcemap: boolean;
    /**
     * * `compatible` means "src/index.ts" will generate "dist/index.d.mts", "dist/index.d.cts" and "dist/index.d.ts".
     * * `node16` means "src/index.ts" will generate "dist/index.d.mts" and "dist/index.d.cts".
     * * `true` is equivalent to `compatible`.
     * * `false` will disable declaration generation.
     * * `undefined` will auto detect based on "package.json". If "package.json" has "types" field, it will be `"compatible"`, otherwise `false`.
     */
    declaration?: "compatible" | "node16" | boolean;
    outDir: string;
    stub: boolean;
    stubOptions: {
        jiti: Omit<JITIOptions, "transform" | "onError">;
    };
    externals: (string | RegExp)[];
    dependencies: string[];
    peerDependencies: string[];
    devDependencies: string[];
    alias: {
        [find: string]: string;
    };
    replace: {
        [find: string]: string;
    };
    failOnWarn?: boolean;
    rollup: RollupBuildOptions;
}
interface BuildContext {
    options: BuildOptions;
    pkg: PackageJson;
    buildEntries: {
        path: string;
        bytes?: number;
        exports?: string[];
        chunks?: string[];
        chunk?: boolean;
        modules?: {
            id: string;
            bytes: number;
        }[];
    }[];
    usedImports: Set<string>;
    warnings: Set<string>;
    hooks: Hookable<BuildHooks>;
}
type BuildPreset = BuildConfig | (() => BuildConfig);
type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
interface BuildConfig extends DeepPartial<Omit<BuildOptions, "entries">> {
    entries?: (BuildEntry | string)[];
    preset?: string | BuildPreset;
    hooks?: Partial<BuildHooks>;
}
interface UntypedOutput {
    fileName: string;
    contents: string;
}
interface UntypedOutputs {
    markdown: UntypedOutput;
    schema: UntypedOutput;
    defaults: UntypedOutput;
    declaration?: UntypedOutput;
}
interface BuildHooks {
    "build:prepare": (ctx: BuildContext) => void | Promise<void>;
    "build:before": (ctx: BuildContext) => void | Promise<void>;
    "build:done": (ctx: BuildContext) => void | Promise<void>;
    "rollup:options": (ctx: BuildContext, options: RollupOptions) => void | Promise<void>;
    "rollup:build": (ctx: BuildContext, build: RollupBuild) => void | Promise<void>;
    "rollup:dts:options": (ctx: BuildContext, options: RollupOptions) => void | Promise<void>;
    "rollup:dts:build": (ctx: BuildContext, build: RollupBuild) => void | Promise<void>;
    "rollup:done": (ctx: BuildContext) => void | Promise<void>;
    "mkdist:entries": (ctx: BuildContext, entries: MkdistBuildEntry[]) => void | Promise<void>;
    "mkdist:entry:options": (ctx: BuildContext, entry: MkdistBuildEntry, options: MkdistOptions) => void | Promise<void>;
    "mkdist:entry:build": (ctx: BuildContext, entry: MkdistBuildEntry, output: {
        writtenFiles: string[];
    }) => void | Promise<void>;
    "mkdist:done": (ctx: BuildContext) => void | Promise<void>;
    "untyped:entries": (ctx: BuildContext, entries: UntypedBuildEntry[]) => void | Promise<void>;
    "untyped:entry:options": (ctx: BuildContext, entry: UntypedBuildEntry, options: any) => void | Promise<void>;
    "untyped:entry:schema": (ctx: BuildContext, entry: UntypedBuildEntry, schema: Schema) => void | Promise<void>;
    "untyped:entry:outputs": (ctx: BuildContext, entry: UntypedBuildEntry, outputs: UntypedOutputs) => void | Promise<void>;
    "untyped:done": (ctx: BuildContext) => void | Promise<void>;
}
declare function defineBuildConfig(config: BuildConfig | BuildConfig[]): BuildConfig[];
declare function definePreset(preset: BuildPreset): BuildPreset;

declare function build(rootDir: string, stub: boolean, inputConfig?: BuildConfig): Promise<void>;

export { type BaseBuildEntry, type BuildConfig, type BuildContext, type BuildEntry, type BuildHooks, type BuildOptions, type BuildPreset, type MkdistBuildEntry, type RollupBuildEntry, type RollupBuildOptions, type RollupCommonJSOptions, type UntypedBuildEntry, type UntypedOutput, type UntypedOutputs, build, defineBuildConfig, definePreset };
