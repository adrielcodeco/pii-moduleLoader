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
        const _alias = this.aliases.filter(a => a.alias === alias).find(i => true);
        if (_alias) {
            _alias.path = path;
        }
        else {
            this.aliases.push({ alias, path });
        }
    }
    _resolveFilename(request, parent, isMain, options) {
        const alias = this.aliases
            .filter(a => request.startsWith(a.alias + '/') || a.alias === request)
            .sort((a1, a2) => {
            if (a1.alias.length < a2.alias.length)
                return 1;
            if (a1.alias.length > a2.alias.length)
                return -1;
            return 0;
        })
            .find(i => true);
        if (alias) {
            const aliaspath = alias.alias === request
                ? alias.path
                : path.resolve(alias.path, '.' + request.replace(alias.alias, ''));
            return this._resolveFilenameOld(aliaspath, parent, isMain, options);
        }
        else {
            return this._resolveFilenameOld(request, parent, isMain, options);
        }
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
                _exports.default =
                    _exports[process.env.NODE_ENV || 'development'];
            }
        }
        return _exports;
    }
}
const moduleLoader = new ModuleLoader();
function useAlias(alias, path) {
    moduleLoader.useAlias(alias, path);
}
exports.default = useAlias;

//# sourceMappingURL=index.js.map
