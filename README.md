# [Pii moduleLoader](https://github.com/adrielcodeco/pii-moduleloader)

Pii moduleLoader is a hack for require

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