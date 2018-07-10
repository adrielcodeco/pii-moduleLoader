/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as path from 'path'

const Module: any = module.constructor

class ModuleLoader {
  private aliases: { alias: string; path: string }[] = []
  private _resolveFilenameOld: Function
  private _loadOld: Function

  constructor () {
    this._resolveFilenameOld = Module._resolveFilename
    this._loadOld = Module._load
    Module._resolveFilename = this._resolveFilename.bind(this)
    Module._load = this._load.bind(this)
  }

  public useAlias (alias: string, path: string) {
    const _alias = this.aliases.filter(a => a.alias === alias).find(i => true)
    if (_alias) {
      _alias.path = path
    } else {
      this.aliases.push({ alias, path })
    }
  }

  private _resolveFilename (
    request: string,
    parent: any,
    isMain: boolean,
    options: any
  ) {
    const alias = this.aliases
      .filter(a => request.startsWith(a.alias + '/') || a.alias === request)
      .sort((a1, a2) => {
        if (a1.alias.length < a2.alias.length) return 1
        if (a1.alias.length > a2.alias.length) return -1
        return 0
      })
      .find(i => true)
    if (alias) {
      const aliaspath =
        alias.alias === request
          ? alias.path
          : path.resolve(alias.path, '.' + request.replace(alias.alias, ''))
      return this._resolveFilenameOld(aliaspath, parent, isMain, options)
    } else {
      return this._resolveFilenameOld(request, parent, isMain, options)
    }
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
        _exports.default =
          _exports[process.env.NODE_ENV || 'development']
      }
    }
    return _exports
  }
}

const moduleLoader = new ModuleLoader()

export default function useAlias (alias: string, path: string) {
  moduleLoader.useAlias(alias, path)
}
