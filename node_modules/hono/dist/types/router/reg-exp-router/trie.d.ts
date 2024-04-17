import type { ParamAssocArray, Context } from './node';
import { Node } from './node';
export type ReplacementMap = number[];
export declare class Trie {
    context: Context;
    root: Node;
    insert(path: string, index: number, pathErrorCheckOnly: boolean): ParamAssocArray;
    buildRegExp(): [RegExp, ReplacementMap, ReplacementMap];
}
