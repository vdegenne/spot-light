import { directive, AsyncDirective } from 'lit/async-directive.js';
import { nothing } from 'lit';
import { PartType } from 'lit/directive.js';
/**
 * Determines if a target is an element
 * @param {EventTarget} target Target to test
 * @return {boolean}
 */
function isElement(target) {
    return target.nodeType === Node.ELEMENT_NODE;
}
/**
 * Determines if a target is an input element
 * @param {EventTarget} target Target to test
 * @return {boolean}
 */
function isInputElement(target) {
    return isElement(target) && (target.nodeName === 'INPUT' || 'type' in target);
}
/**
 * Determines if a target is a select element
 * @param {EventTarget} target Target to test
 * @return {boolean}
 */
function isSelectElement(target) {
    return isElement(target) && target.nodeName === 'SELECT';
}
///**
// * Determines if a target is a textarea element
// * @param {EventTarget} target Target to test
// * @return {boolean}
// */
//function isTextAreaElement(target: EventTarget): target is HTMLTextAreaElement {
//  return isElement(target) && target.nodeName === 'TEXTAREA';
//}
/**
 * Tracks the value of a form control and propagates data two-way to/from a
 * given host property.
 */
class BindInputDirective extends AsyncDirective {
    /** @inheritdoc */
    constructor(partInfo) {
        super(partInfo);
        this.__host = undefined;
        this.__lastValue = undefined;
        /**
         * Fired when the change event occurs
         * @param {Event} ev Event fired
         * @return {void}
         */
        this.__onChange = (ev) => {
            const target = ev.currentTarget;
            if (target !== this.__element) {
                return;
            }
            this.__updateValueFromElement(this.__element);
        };
        /**
         * Fired when the input event occurs
         * @param {Event} ev Event fired
         * @return {void}
         */
        this.__onInput = (ev) => {
            const target = ev.currentTarget;
            if (target !== this.__element) {
                return;
            }
            this.__updateValueFromElement(this.__element);
        };
        if (partInfo.type !== PartType.ELEMENT &&
            partInfo.type !== PartType.ATTRIBUTE &&
            partInfo.type !== PartType.PROPERTY) {
            throw new Error('The `bindInput` directive must be used in an element or ' +
                'attribute binding');
        }
        this.__isAttribute =
            partInfo.type === PartType.ATTRIBUTE ||
                partInfo.type === PartType.PROPERTY;
    }
    /** @inheritdoc */
    render(host, prop) {
        if (this.__isAttribute) {
            return this.__computeValueFromHost(host, prop);
        }
        return nothing;
    }
    /** @inheritdoc */
    update(part, [host, prop]) {
        if (part.element !== this.__element) {
            this.__setElement(part.element);
        }
        if (prop !== this.__prop) {
            this.__prop = prop;
        }
        if (host !== this.__host) {
            this.__host = host;
        }
        if (host && !this.__isAttribute) {
            this.__updateValueFromHost(host);
        }
        return this.render(host, prop);
    }
    /**
     * Gets the value of the property from the host
     * @param {unknown} host Host to retrieve value from
     * @param {string|symbol|number} prop Property to retrieve
     * @return {unknown}
     */
    __computeValueFromHost(host, prop) {
        if (typeof host !== 'object' || host === null || !(prop in host)) {
            return undefined;
        }
        return host[prop];
    }
    /**
     * Updates the value based on the host's current value for the given
     * property
     * @param {unknown} host Host to retrieve value from
     * @return {void}
     */
    __updateValueFromHost(host) {
        if (!this.__prop || !this.__element) {
            return;
        }
        const value = this.__computeValueFromHost(host, this.__prop);
        const element = this.__element;
        if (value === this.__lastValue) {
            return;
        }
        this.__lastValue = value;
        if (isSelectElement(element)) {
            switch (element.type.toLowerCase()) {
                case 'select-multiple':
                    const valuesArray = Array.isArray(value) ? value : [value];
                    for (const opt of element.options) {
                        if (valuesArray.includes(opt.value)) {
                            opt.selected = true;
                        }
                    }
                    break;
                case 'select-one':
                default:
                    element.value = String(value ?? '');
            }
        }
        else if (isInputElement(element)) {
            switch (element.type.toLowerCase()) {
                case 'checkbox':
                    element.checked = value === true;
                    break;
                case 'number':
                case 'date':
                case 'time':
                    element.valueAsNumber = value;
                    break;
                case 'textarea':
                default:
                    element.value = String(value ?? '');
            }
        }
        else if ('value' in element) {
            element.value = value;
        }
    }
    /**
     * Sets the element and its handlers
     * @param {Element} element Element to set
     * @return {void}
     */
    __setElement(element) {
        if (this.__element) {
            this.__removeListenersFromElement(this.__element);
        }
        this.__element = element;
        this.__addListenersToElement(element);
    }
    /**
     * Removes any associated listeners from the given element
     * @param {Element} element Element to remove listeners from
     * @return {void}
     */
    __removeListenersFromElement(element) {
        element.removeEventListener('change', this.__onChange);
        element.removeEventListener('input', this.__onInput);
    }
    /**
     * Adds any associated listeners to the given element
     * @param {Element} element Element to add listeners to
     * @return {void}
     */
    __addListenersToElement(element) {
        element.addEventListener('change', this.__onChange);
        element.addEventListener('input', this.__onInput);
    }
    /**
     * Retrieves the value of a given element
     * @param {Element} element Element to retrieve value from
     * @return {unknown}
     */
    __getValueFromElement(element) {
        let value = undefined;
        if (isSelectElement(element)) {
            switch (element.type.toLowerCase()) {
                case 'select-multiple':
                    value = [...element.selectedOptions].map((opt) => opt.value);
                    break;
                case 'select-one':
                default:
                    value = element.value;
            }
        }
        else if (isInputElement(element)) {
            switch (element.type.toLowerCase()) {
                case 'checkbox':
                    value = element.checked === true;
                    break;
                case 'number':
                case 'date':
                case 'time':
                    value = element.valueAsNumber;
                    break;
                case 'textarea':
                default:
                    value = element.value;
            }
        }
        else if ('value' in element) {
            value = element.value;
        }
        return value;
    }
    /**
     * Updates the host value from an element
     * @param {Element} element Element to retrieve value from
     * @return {void}
     */
    __updateValueFromElement(element) {
        if (!this.__prop) {
            return;
        }
        if (!this.__host ||
            typeof this.__host !== 'object' ||
            !(this.__prop in this.__host)) {
            return;
        }
        const value = this.__getValueFromElement(element);
        this.__lastValue = value;
        this.__host[this.__prop] = value;
    }
    /** @inheritdoc */
    reconnected() {
        if (this.__element) {
            this.__addListenersToElement(this.__element);
        }
    }
    /** @inheritdoc */
    disconnected() {
        if (this.__element) {
            this.__removeListenersFromElement(this.__element);
        }
    }
}
const bindInputDirective = directive(BindInputDirective);
/**
 * Two-way binds a given property to the input it is defined on.
 *
 * For example:
 *
 * ```ts
 * html`
 *  <input type="text" ${input(this, 'name')}>
 * `;
 * ```
 *
 * @param {T} host Host object of the property
 * @param {string} key Property to bind
 * @return {DirectiveResult}
 */
export function bindInput(host, key) {
    return bindInputDirective(host, key);
}
