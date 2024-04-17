import type { Params } from '../../router';
import type { Pattern } from '../../utils/url';
type HandlerSet<T> = {
    handler: T;
    possibleKeys: string[];
    score: number;
    name: string;
};
export declare class Node<T> {
    methods: Record<string, HandlerSet<T>>[];
    children: Record<string, Node<T>>;
    patterns: Pattern[];
    order: number;
    name: string;
    params: Record<string, string>;
    constructor(method?: string, handler?: T, children?: Record<string, Node<T>>);
    insert(method: string, path: string, handler: T): Node<T>;
    private gHSets;
    search(method: string, path: string): [[T, Params][]];
}
export {};
