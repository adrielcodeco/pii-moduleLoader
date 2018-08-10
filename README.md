# [Pii moduleLoader](https://github.com/adrielcodeco/pii-moduleloader)

Pii moduleLoader is a hack for require

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Build Status (linux, Mac)](https://travis-ci.org/adrielcodeco/pii-moduleLoader.svg?branch=master)](https://travis-ci.org/adrielcodeco/pii-moduleLoader)
[![Build status (Windows)](https://ci.appveyor.com/api/projects/status/77rbxqniyvywpw6k/branch/master?svg=true)](https://ci.appveyor.com/project/adrielcodeco/pii-moduleLoader/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/adrielcodeco/pii-moduleLoader/badge.svg?branch=master)](https://coveralls.io/github/adrielcodeco/pii-moduleLoader?branch=master)

[![NPM](https://nodei.co/npm/@pii/moduleLoader.png)](https://npmjs.org/package/@pii/moduleLoader)

## Documentation

* [Quick Start](https://github.com/adrielcodeco/pii-moduleloader/quick-start.html)
* [Examples](https://github.com/adrielcodeco/pii-moduleloader/examples.html)

## Examples

Here is a simple example to get you started:

index.js

```js
import useAlias from '@pii/moduleLoader'

useAlias('@src', require.resolve(./src))

require('@src/test.js')
```

src/test.js
```js
console.log('file loaded')
```

### License

This project is [MIT licensed](./LICENSE).