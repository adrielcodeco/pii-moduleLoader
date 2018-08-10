/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as path from 'path'

type Alias = { alias: string | RegExp; path: string }

const Module: any = module.constructor

class ModuleLoader {
  private aliases: Alias[] = []
  private _resolveFilenameOld: Function
  private _loadOld: Function

  constructor () {
    this._resolveFilenameOld = Module._resolveFilename
    this._loadOld = Module._load
    Module._resolveFilename = this._resolveFilename.bind(this)
    Module._load = this._load.bind(this)
  }

  public useAlias (alias: string | RegExp, path: string) {
    const _alias = this.aliases.filter(a => {
      if (typeof alias === 'string' && typeof a.alias === 'string') {
        return a.alias === alias
      } else if (typeof alias === 'object' && typeof a.alias === 'object') {
        return a.alias.source === alias.source
      }
      return false
    }).find(i => true)
    if (_alias) {
      _alias.path = path
    } else {
      this.aliases.push({ alias, path })
    }
  }

  public resolvePath (request: string) {
    const alias = this.aliases
      .filter(a => {
        if (typeof a.alias === 'string') {
          return a.alias === request
        } else {
          return a.alias.test(request)
        }
      })
      .sort((a1: Alias, a2: Alias) => {
        if (typeof a1.alias === 'string' && typeof a2.alias === 'string') {
          if (a1.alias.length < a2.alias.length) return 1
          if (a1.alias.length > a2.alias.length) return -1
        } else if (
          typeof a1.alias === 'string' &&
          typeof a2.alias !== 'string'
        ) {
          return 1
        } else if (
          typeof a1.alias !== 'string' &&
          typeof a2.alias === 'string'
        ) {
          return -1
        } else if (
          typeof a1.alias !== 'string' &&
          typeof a2.alias !== 'string'
        ) {
          const r1 = a1.alias.exec(request) as RegExpExecArray
          const r2 = a2.alias.exec(request) as RegExpExecArray
          const rv1 = r1
            .sort((v1: string, v2: string) => (v1.length > v2.length ? 1 : -1))
            .find(() => true) as string
          const rv2 = r2
            .sort((v1: string, v2: string) => (v1.length > v2.length ? 1 : -1))
            .find(() => true) as string
          return rv1.length > rv2.length ? 1 : -1
        }
        return 0
      })
      .find(() => true)
    if (alias) {
      let aliaspath
      if (typeof alias.alias === 'string') {
        aliaspath = alias.path
      } else {
        aliaspath = path.resolve(
          alias.path,
          `./${(alias.alias.exec(request) as RegExpExecArray)[1]}`
        )
      }
      return aliaspath
    }
    return request
  }

  private _resolveFilename (
    request: string,
    parent: any,
    isMain: boolean,
    options: any
  ) {
    const aliaspath = this.resolvePath(request)
    return this._resolveFilenameOld(aliaspath, parent, isMain, options)
  }

  private _load (request: string, parent: any, isMain: boolean) {
    const _exports = this._loadOld(request, parent, isMain)
    if (
      typeof _exports === 'object' &&
      Reflect.ownKeys(_exports).length > 0 &&
      (process.env.NODE_ENV || 'development') in _exports
    ) {
      if (typeof _exports.default === 'object') {
        _exports.default = Object.assign(
          {},
          _exports.default,
          _exports[process.env.NODE_ENV || 'development']
        )
      } else {
        _exports.default = _exports[process.env.NODE_ENV || 'development']
      }
    }
    return _exports
  }
}

const moduleLoader = new ModuleLoader()

export function resolvePath (path: string) {
  return moduleLoader.resolvePath(path)
}

export default function useAlias (alias: string | RegExp, path: string): void {
  moduleLoader.useAlias(alias, path)
}
