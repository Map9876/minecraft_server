"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryWrapper = exports.LocalFileSource = exports.MySqlSource = exports.QueryMapWrapper = void 0;
// Provide the MAP query interface used by the routing layer
class QueryMapWrapper {
    constructor(map) {
        this.map = map;
    }
    select(condition) {
        const result = [];
        this.map.forEach((v) => {
            if (condition(v))
                result.push(v);
        });
        return result;
    }
    page(data, page = 1, pageSize = 10) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        let size = data.length;
        let maxPage = 0;
        while (size > 0) {
            size -= pageSize;
            maxPage++;
        }
        return {
            page,
            pageSize,
            maxPage,
            data: data.slice(start, end)
        };
    }
}
exports.QueryMapWrapper = QueryMapWrapper;
// MYSQL data source
class MySqlSource {
    constructor(data) {
        this.data = data;
    }
    selectPage(condition, page, pageSize) {
        return {
            page,
            pageSize,
            maxPage: 0,
            total: 0,
            data: []
        };
    }
    select(condition) {
        return [];
    }
    update(condition, data) { }
    delete(condition) { }
    insert(data) { }
}
exports.MySqlSource = MySqlSource;
// local file data source (embedded microdatabase)
class LocalFileSource {
    constructor(data) {
        this.data = data;
    }
    selectPage(condition, page = 1, pageSize = 10) {
        const result = [];
        this.data.forEach((v) => {
            for (const key in condition) {
                const dataValue = v[key];
                const targetValue = condition[key];
                if (targetValue[0] == "%") {
                    if (!dataValue.includes(targetValue.slice(1, targetValue.length - 1)))
                        return false;
                }
                else {
                    if (targetValue !== dataValue)
                        return false;
                }
            }
            result.push(v);
        });
        return this.page(result, page, pageSize);
    }
    page(data, page = 1, pageSize = 10) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        let size = data.length;
        let maxPage = 0;
        while (size > 0) {
            size -= pageSize;
            maxPage++;
        }
        return {
            page,
            pageSize,
            maxPage,
            total: data.length,
            data: data.slice(start, end)
        };
    }
    select(condition) {
        return [];
    }
    update(condition, data) { }
    delete(condition) { }
    insert(data) { }
}
exports.LocalFileSource = LocalFileSource;
// Provide the unified data query interface used by the routing layer
class QueryWrapper {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    selectPage(condition, page = 1, pageSize = 10) {
        return this.dataSource.selectPage(condition, page, pageSize);
    }
}
exports.QueryWrapper = QueryWrapper;
//# sourceMappingURL=query_wrapper.js.map