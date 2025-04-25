var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
let SpotLight = class SpotLight extends LitElement {
    constructor() {
        super(...arguments);
        this.color = 'white';
        this.switched = true;
        this.sizePx = 2400;
        this.brightness = 0.9;
        this.clipAngle = 120;
        this.diffusion = 12;
    }
    static { this.styles = css `
		:host {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 0;
			pointer-events: none;
			overflow: visible;
		}

		.spot {
			position: absolute;
			left: 50%;
			transition: filter 0.3s ease-in-out;
		}
	`; }
    render() {
        const style = styleMap({
            width: `${this.sizePx}px`,
            height: `${this.sizePx}px`,
            background: `radial-gradient(circle, ${this.color} 0%, transparent ${this.diffusion}%)`,
            clipPath: `polygon(50% 50%, ${50 + this.clipAngle}% 100%, ${50 - this.clipAngle}% 100%)`,
            // filter: `brightness(${this.brightness})`,
            opacity: `${this.brightness}`,
            transform: `translate(-50%, -${this.sizePx / 1.99}px)`,
        });
        return html `<div class="spot" style="${style}"></div>`;
    }
};
__decorate([
    property({ reflect: true })
], SpotLight.prototype, "color", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], SpotLight.prototype, "switched", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'size-px' })
], SpotLight.prototype, "sizePx", void 0);
__decorate([
    property({ type: Number, reflect: true })
], SpotLight.prototype, "brightness", void 0);
__decorate([
    property({ type: Number, reflect: true })
], SpotLight.prototype, "clipAngle", void 0);
__decorate([
    property({ type: Number, reflect: true })
], SpotLight.prototype, "diffusion", void 0);
SpotLight = __decorate([
    customElement('spot-light')
], SpotLight);
export { SpotLight };
