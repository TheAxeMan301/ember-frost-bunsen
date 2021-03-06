import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from '../utils'
import {getCellDefaults} from '../validator/defaults'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Component.extend(PropTypeMixin, {
  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    errorMessage: PropTypes.oneOf([
      PropTypes.null,
      PropTypes.string
    ]),
    label: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired,
    value: PropTypes.oneOf([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.null,
      PropTypes.number,
      PropTypes.object,
      PropTypes.string
    ])
  },

  getDefaultProps () {
    return {
      required: false,
      showErrorMessage: false
    }
  },

  @readOnly
  @computed('errorMessage', 'showErrorMessage')
  renderErrorMessage (errorMessage, showErrorMessage) {
    if (!showErrorMessage) {
      return null
    }

    return errorMessage
  },

  @readOnly
  @computed('renderErrorMessage')
  /**
   * Get class name for input element
   * @param {String} errorMessage - error message for input
   * @returns {String} input class name
   */
  inputClassName (errorMessage) {
    return errorMessage ? 'error' : ''
  },

  @readOnly
  @computed('cellConfig.inputClassName')
  /**
   * Get class name for input wrapper element
   * @param {String} inputClassName - class name defined in view definition
   * @returns {String} input wrapper element class name
   */
  inputWrapperClassName (inputClassName) {
    return inputClassName || defaultClassNames.inputWrapper
  },

  @readOnly
  @computed('cellConfig.labelClassName')
  /**
   * Get class name for label wrapper element
   * @param {String} labelClassName - class name defined in view definition
   * @returns {String} label wrapper element class name
   */
  labelWrapperClassName (labelClassName) {
    return labelClassName || defaultClassNames.labelWrapper
  },

  @readOnly
  @computed('bunsenId', 'cellConfig', 'label', 'model')
  /**
   * Get current label text for input
   * @param {String} bunsenId - bunsen ID for input (represents path in model)
   * @param {BunsenCell} cellConfig - view definition for input
   * @param {String} label - label
   * @param {BunsenModel} model - bunsen model
   * @returns {String} label text
   */
  renderLabel (bunsenId, cellConfig, label, model) {
    const config = _.defaults({}, cellConfig, getCellDefaults())
    const customLabel = label || config.label
    return getLabel(customLabel, model, bunsenId)
  },

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} value - value to parse
   * @returns {any} parsed value
   */
  parseValue (value) {
    return value
  },

  actions: {
    /**
     * When input looses focus we want to start showing error messages
     */
    onBlur () {
      if (!this.get('showErrorMessage')) {
        this.set('showErrorMessage', true)
      }
    },

    /**
     * When input enters focus we want to stop showing error messages
     */
    onFocus () {
      if (this.get('showErrorMessage')) {
        this.set('showErrorMessage', false)
      }
    },

    /**
     * Handle user updating value
     * @param {Event} e - event
     */
    onChange (e) {
      const bunsenId = this.get('bunsenId')
      const value = e.value !== undefined ? e.value : _.get(e, 'target.value')
      const newValue = this.parseValue(value)
      const oldValue = this.get('value')
      const onChange = this.get('onChange')

      if (onChange && !_.isEqual(newValue, oldValue)) {
        onChange(bunsenId, newValue)
      }
    }
  }
})
