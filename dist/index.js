"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var Module = module.constructor;
var ModuleLoader = (function () {
    function ModuleLoader() {
        this.aliases = [];
        this._resolveFilenameOld = Module._resolveFilename;
        this._loadOld = Module._load;
        Module._resolveFilename = this._resolveFilename.bind(this);
        Module._load = this._load.bind(this);
    }
    ModuleLoader.prototype.useAlias = function (alias, path) {
        var _alias = this.aliases.filter(function (a) {
            if (typeof alias === 'string' && typeof a.alias === 'string') {
                return a.alias === alias;
            }
            else if (typeof alias === 'object' && typeof a.alias === 'object') {
                return a.alias.source === alias.source;
            }
            return false;
        }).find(function (i) { return true; });
        if (_alias) {
            _alias.path = path;
        }
        else {
            this.aliases.push({ alias: alias, path: path });
        }
    };
    ModuleLoader.prototype.resolvePath = function (request) {
        var alias = this.aliases
            .filter(function (a) {
            if (typeof a.alias === 'string') {
                return a.alias === request;
            }
            else {
                return a.alias.test(request);
            }
        })
            .sort(function (a1, a2) {
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
                var r1 = a1.alias.exec(request);
                var r2 = a2.alias.exec(request);
                var rv1 = r1
                    .sort(function (v1, v2) { return (v1.length > v2.length ? 1 : -1); })
                    .find(function () { return true; });
                var rv2 = r2
                    .sort(function (v1, v2) { return (v1.length > v2.length ? 1 : -1); })
                    .find(function () { return true; });
                return rv1.length > rv2.length ? 1 : -1;
            }
            return 0;
        })
            .find(function () { return true; });
        if (alias) {
            var aliaspath = void 0;
            if (typeof alias.alias === 'string') {
                aliaspath = alias.path;
            }
            else {
                aliaspath = path.resolve(alias.path, "./" + alias.alias.exec(request)[1]);
            }
            return aliaspath;
        }
        return request;
    };
    ModuleLoader.prototype._resolveFilename = function (request, parent, isMain, options) {
        var aliaspath = this.resolvePath(request);
        return this._resolveFilenameOld(aliaspath, parent, isMain, options);
    };
    ModuleLoader.prototype._load = function (request, parent, isMain) {
        var _exports = this._loadOld(request, parent, isMain);
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
    };
    return ModuleLoader;
}());
var moduleLoader = new ModuleLoader();
function resolvePath(path) {
    return moduleLoader.resolvePath(path);
}
exports.resolvePath = resolvePath;
function useAlias(alias, path) {
    moduleLoader.useAlias(alias, path);
}
exports.default = useAlias;

//# sourceMappingURL=index.js.map
