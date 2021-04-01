// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import assert from 'assert'
import { checkDialogElementForError, checkIfErrorsMatchElements } from 'utils/integration_utils'

describe('integration utils', () => {
  describe('checkDialogElementForError', () => {
    it('should return null error on optional text element', () => {
      assert.equal(checkDialogElementForError({ type: 'text', optional: true } as any), null)
    })

    it('should return null error on optional textarea element', () => {
      assert.equal(checkDialogElementForError({ type: 'textarea', optional: true } as any), null)
    })

    it('should return error on required element', () => {
      assert.equal(
        checkDialogElementForError({ type: 'text', optional: false } as any).id,
        'interactive_dialog.error.required'
      )
    })

    it('should return error on too short text element', () => {
      assert.equal(
        checkDialogElementForError({ type: 'text', min_length: 5 } as any, '123').id,
        'interactive_dialog.error.too_short'
      )
    })

    it('should return null on good number element', () => {
      assert.equal(checkDialogElementForError({ type: 'text', subtype: 'number' } as any, '123'), null)
    })

    it('should return error on bad number element', () => {
      assert.equal(
        checkDialogElementForError({ type: 'text', subtype: 'number' } as any, 'totallyanumber').id,
        'interactive_dialog.error.bad_number'
      )
    })

    it('should return null on good email element', () => {
      assert.equal(checkDialogElementForError({ type: 'text', subtype: 'email' } as any, 'joram@mattermost.com'), null)
    })

    it('should return error on bad email element', () => {
      assert.equal(
        checkDialogElementForError({ type: 'text', subtype: 'email' } as any, 'totallyanemail').id,
        'interactive_dialog.error.bad_email'
      )
    })

    it('should return null on good url element', () => {
      assert.equal(checkDialogElementForError({ type: 'text', subtype: 'url' } as any, 'http://mattermost.com'), null)
      assert.equal(checkDialogElementForError({ type: 'text', subtype: 'url' } as any, 'https://mattermost.com'), null)
    })

    it('should return error on bad url element', () => {
      assert.equal(
        checkDialogElementForError({ type: 'text', subtype: 'url' } as any, 'totallyawebsite').id,
        'interactive_dialog.error.bad_url'
      )
    })

    it('should return null when value is in the options', () => {
      assert.equal(checkDialogElementForError({ type: 'radio', options: [{ value: 'Sales' }] } as any, 'Sales'), null)
    })

    it('should return error when value is not in the options', () => {
      assert.equal(
        checkDialogElementForError({ type: 'radio', options: [{ value: 'Sales' }] } as any, 'Sale').id,
        'interactive_dialog.error.invalid_option'
      )
    })

    it('should return error when value is falsey and not on the list of options', () => {
      assert.equal(
        checkDialogElementForError({ type: 'radio', options: [{ value: false }] } as any, 'Sale').id,
        'interactive_dialog.error.invalid_option'
      )

      assert.equal(
        checkDialogElementForError({ type: 'radio', options: [{ value: undefined }] } as any, 'Sale').id,
        'interactive_dialog.error.invalid_option'
      )

      assert.equal(
        checkDialogElementForError({ type: 'radio', options: [{ value: null }] } as any, 'Sale').id,
        'interactive_dialog.error.invalid_option'
      )
    })
  })

  describe('checkIfErrorsMatchElements', () => {
    it('should pass as returned error matches an element', () => {
      assert.ok(checkIfErrorsMatchElements({ name1: 'some error' } as any, [{ name: 'name1' }] as any))
      assert.ok(
        checkIfErrorsMatchElements({ name1: 'some error' } as any, [{ name: 'name1' }, { name: 'name2' }] as any)
      )
    })

    it('should fail as returned errors do not match an element', () => {
      assert.ok(
        !checkIfErrorsMatchElements({ name17: 'some error' } as any, [{ name: 'name1' }, { name: 'name2' }] as any)
      )
    })
  })
})
