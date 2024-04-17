#!/usr/bin/env node
import { defineCommand, runMain } from 'citty';
import consola from 'consola';
import { resolve } from 'pathe';
import { build } from './index.mjs';
import 'node:module';
import 'node:fs';
import 'chalk';
import 'defu';
import 'hookable';
import 'pretty-bytes';
import 'globby';
import 'node:fs/promises';
import 'jiti';
import 'node:url';
import 'rollup';
import '@rollup/plugin-commonjs';
import '@rollup/plugin-node-resolve';
import '@rollup/plugin-alias';
import 'rollup-plugin-dts';
import '@rollup/plugin-replace';
import 'mlly';
import 'esbuild';
import '@rollup/pluginutils';
import '@rollup/plugin-json';
import 'magic-string';
import 'untyped';
import 'untyped/babel-plugin';
import 'scule';
import 'mkdist';

const name = "unbuild";
const version = "2.0.0";
const description = "A unified javascript build system";

const main = defineCommand({
  meta: {
    name,
    version,
    description
  },
  args: {
    dir: {
      type: "positional",
      description: "The directory to build",
      required: false
    },
    stub: {
      type: "boolean",
      description: "Stub build"
    },
    minify: {
      type: "boolean",
      description: "Minify build"
    },
    sourcemap: {
      type: "boolean",
      description: "Generate sourcemaps (experimental)"
    }
  },
  async run({ args }) {
    const rootDir = resolve(process.cwd(), args.dir || ".");
    await build(rootDir, args.stub, {
      sourcemap: args.sourcemap,
      rollup: {
        esbuild: {
          minify: args.minify
        }
      }
    }).catch((error) => {
      consola.error(`Error building ${rootDir}: ${error}`);
      throw error;
    });
  }
});
runMain(main);
