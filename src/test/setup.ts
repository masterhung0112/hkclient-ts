// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
global.WebSocket = require('ws');

require('isomorphic-fetch');

// let warns
// let errors
// beforeAll(() => {
//   const constAny = console as any
//   constAny.originalWarn = console.warn
//   console.warn = jest.fn((...params) => {
//     constAny.originalWarn(...params)
//     warns.push(params)
//   })

//   constAny.originalError = console.error
//   console.error = jest.fn((...params) => {
//     constAny.originalError(...params)
//     errors.push(params)
//   })
// })

// beforeEach(() => {
//   warns = []
//   errors = []
// })

// afterEach(() => {
//   if (warns.length > 0 || errors.length > 0) {
//     throw new Error('Unexpected console logs' + warns + errors)
//   }
// })
