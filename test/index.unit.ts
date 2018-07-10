/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export {}

const requireTest = () => {
  return require('../src').default
}

test('require', () => {
  expect.assertions(1)
  const unit = requireTest()
  expect(typeof unit).toEqual('function')
})

test('call useAlias without arguments', () => {
  expect.assertions(1)
  const unit = requireTest()
  expect(() => {
    unit()
  }).not.toThrow()
})
