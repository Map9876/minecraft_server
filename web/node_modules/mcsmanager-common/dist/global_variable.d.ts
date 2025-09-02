export default class GlobalVariable {
    static readonly map: Map<string, any>;
    static set(k: string, v: any): void;
    static get(k: string, def?: any): any;
    static del(k: string): boolean;
}
