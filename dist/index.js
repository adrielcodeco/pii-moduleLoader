"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Module = module.constructor;
class ModuleLoader {
    constructor() {
        this.aliases = [];
        this._resolveFilenameOld = Module._resolveFilename;
        this._loadOld = Module._load;
        Module._resolveFilename = this._resolveFilename.bind(this);
        Module._load = this._load.bind(this);
    }
    useAlias(alias, path) {
        const _alias = this.aliases.filter(a => {
            if (typeof alias === 'string' && typeof a.alias === 'string') {
                return a.alias === alias;
            }
            else if (typeof alias === 'object' && typeof a.alias === 'object') {
                return a.alias.source === alias.source;
            }
            return false;
        }).find(i => true);
        if (_alias) {
            _alias.path = path;
        }
        else {
            this.aliases.push({ alias, path });
        }
    }
    resolvePath(request) {
        const alias = this.aliases
            .filter(a => {
            if (typeof a.alias === 'string') {
                return a.alias === request;
            }
            else {
                return a.alias.test(request);
            }
        })
            .sort((a1, a2) => {
            if (typeof a1.alias === 'string' && typeof a2.alias === 'string') {
                if (a1.alias.length < a2.alias.length)
                    return 1;
                if (a1.alias.length > a2.alias.length)
                    return -1;
            }
            else if (typeof a1.alias === 'string' &&
                typeof a2.alias !== 'string') {
                return 1;
            }
            else if (typeof a1.alias !== 'string' &&
                typeof a2.alias === 'string') {
                return -1;
            }
            else if (typeof a1.alias !== 'string' &&
                typeof a2.alias !== 'string') {
                const r1 = a1.alias.exec(request);
                const r2 = a2.alias.exec(request);
                const rv1 = r1
                    .sort((v1, v2) => (v1.length > v2.length ? 1 : -1))
                    .find(() => true);
                const rv2 = r2
                    .sort((v1, v2) => (v1.length > v2.length ? 1 : -1))
                    .find(() => true);
                return rv1.length > rv2.length ? 1 : -1;
            }
            return 0;
        })
            .find(() => true);
        if (alias) {
            let aliaspath;
            if (typeof alias.alias === 'string') {
                aliaspath = alias.path;
            }
            else {
                aliaspath = path.resolve(alias.path, `./${alias.alias.exec(request)[1]}`);
            }
            return aliaspath;
        }
        return request;
    }
    _resolveFilename(request, parent, isMain, options) {
        const aliaspath = this.resolvePath(request);
        return this._resolveFilenameOld(aliaspath, parent, isMain, options);
    }
    _load(request, parent, isMain) {
        const _exports = this._loadOld(request, parent, isMain);
        if (typeof _exports === 'object' &&
            Reflect.ownKeys(_exports).length > 0 &&
            (process.env.NODE_ENV || 'development') in _exports) {
            if (typeof _exports.default === 'object') {
                _exports.default = Object.assign({}, _exports.default, _exports[process.env.NODE_ENV || 'development']);
            }
            else {
                _exports.default = _exports[process.env.NODE_ENV || 'development'];
            }
        }
        return _exports;
    }
}
const moduleLoader = new ModuleLoader();
function resolvePath(path) {
    return moduleLoader.resolvePath(path);
}
exports.resolvePath = resolvePath;
function useAlias(alias, path) {
    moduleLoader.useAlias(alias, path);
}
exports.default = useAlias;

//# sourceMappingURL=index.js.map
