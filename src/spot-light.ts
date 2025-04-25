import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

@customElement('spot-light')
export class SpotLight extends LitElement {
	@property({reflect: true}) color = 'white';
	@property({type: Boolean, reflect: true}) switched = true;
	@property({type: Number, reflect: true, attribute: 'size-px'}) sizePx = 2400;
	@property({type: Number, reflect: true}) brightness = 0.9;
	@property({type: Number, reflect: true}) clipAngle = 120;
	@property({type: Number, reflect: true}) diffusion = 12;

	static styles = css`
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
	`;

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
		return html`<div class="spot" style="${style}"></div>`;
	}
}
