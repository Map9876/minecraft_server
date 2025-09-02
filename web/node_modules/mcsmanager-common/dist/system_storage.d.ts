export default class StorageSubsystem {
    static readonly DATA_PATH: string;
    static readonly INDEX_PATH: string;
    private checkFileName;
    writeFile(name: string, data: string): void;
    readFile(name: string): string;
    readDir(dirName: string): string[];
    deleteFile(name: string): void;
    fileExists(name: string): boolean;
    store(category: string, uuid: string, object: any): void;
    protected defineAttr(target: any, object: any): any;
    /**
     * Instantiate an object based on the class definition and identifier
     */
    load(category: string, classz: any, uuid: string): any;
    /**
     * Return all identifiers related to this class through the class definition
     */
    list(category: string): string[];
    /**
     * Delete an identifier instance of the specified type through the class definition
     */
    delete(category: string, uuid: string): void;
}
