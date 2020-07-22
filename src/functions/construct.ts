import { IWebElementConfig } from "../internals/api";
import { render } from "../functions/render";

/* Construct a custom element: */
export function construct(tagName: string, config: IWebElementConfig): void {

    const Component = class extends HTMLElement {
        static get observedAttributes() { return Object.keys(config.watch || Object.create(null)); }

        constructor() {
            // Required super call.
            super();
            
            // Call "created" lifecycle hook:
            config.created && config.created.call(this);

            // Register event handlers:
            if (config.events) {
                for (const eventName in config.events) {
                    this.addEventListener(eventName, config.events[eventName].bind(this));
                }
            }

            // Append children:
            config.render && render((config.render.bind(this))(), this);
        }

        connectedCallback() {
            // Call "mounted" lifecycle hook:
            config.mounted && config.mounted.call(this);
        }

        disconnectedCallback() {
            // Call "mounted" lifecycle hook:
            config.removed && config.removed.call(this);
        }

        adoptedCallback() {
            // Call "mounted" lifecycle hook:
            config.adopted && config.adopted.call(this);
        }

        attributeChangedCallback(name: string, newValue: string, oldValue: string) {
            // Call watcher function for changed attribute:
            config.watch && config.watch[name].call(this, newValue, oldValue);
        }
    };

    // Register element:
    customElements.define(tagName, Component);
}