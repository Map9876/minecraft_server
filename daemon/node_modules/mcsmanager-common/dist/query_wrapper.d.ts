interface IMap {
    size: number;
    forEach: (value: any, key?: any) => void;
}
interface Page<T> {
    page: number;
    pageSize: number;
    maxPage: number;
    total: number;
    data: T[];
}
export declare class QueryMapWrapper {
    map: IMap;
    constructor(map: IMap);
    select<T>(condition: (v: T) => boolean): T[];
    page<T>(data: T[], page?: number, pageSize?: number): {
        page: number;
        pageSize: number;
        maxPage: number;
        data: T[];
    };
}
export interface IDataSource<T> {
    selectPage: (condition: any, page: number, pageSize: number) => Page<T>;
    select: (condition: any) => any[];
    update: (condition: any, data: any) => void;
    delete: (condition: any) => void;
    insert: (data: any) => void;
}
export declare class MySqlSource<T> implements IDataSource<T> {
    data: any;
    constructor(data: any);
    selectPage(condition: any, page: number, pageSize: number): {
        page: number;
        pageSize: number;
        maxPage: number;
        total: number;
        data: never[];
    };
    select(condition: any): never[];
    update(condition: any, data: any): void;
    delete(condition: any): void;
    insert(data: any): void;
}
export declare class LocalFileSource<T> implements IDataSource<T> {
    data: any;
    constructor(data: any);
    selectPage(condition: any, page?: number, pageSize?: number): {
        page: number;
        pageSize: number;
        maxPage: number;
        total: number;
        data: T[];
    };
    page(data: T[], page?: number, pageSize?: number): {
        page: number;
        pageSize: number;
        maxPage: number;
        total: number;
        data: T[];
    };
    select(condition: any): any[];
    update(condition: any, data: any): void;
    delete(condition: any): void;
    insert(data: any): void;
}
export declare class QueryWrapper<T> {
    dataSource: IDataSource<T>;
    constructor(dataSource: IDataSource<T>);
    selectPage(condition: any, page?: number, pageSize?: number): Page<T>;
}
export {};
