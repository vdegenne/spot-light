import {withController} from '@snar/lit';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {F, store} from '../store.js';
import styles from './app-shell.css?inline';
import '../spot-light.js';
import {
	renderColorPicker,
	renderThemeElements,
} from '../styles/theme-elements.js';
import {themeStore} from '../styles/themeStore.js';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

@customElement('app-shell')
@withStyles(styles)
@withController(store)
@withController(themeStore)
export class AppShell extends LitElement {
	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html`<!-- -->
			<md-text-button class="absolute top-3 left-3 text-xl"
				>${'<spot-light></spot-light>'}</md-text-button
			>
			<spot-light
				.brightness=${store.brightness}
				.sizePx="${store.sizePx}"
				.diffusion=${store.diffusion}
				color="${themeStore.themeColor}"
			></spot-light>

			<div class="absolute inset-0 flex flex-col items-center">
				<div class="flex-1"></div>
				<div class="flex-1">
					<div class="flex flex-col gap-4">
						<div class="mb-1 flex items-center gap-4">
							Color ${renderColorPicker()}
						</div>
						${F.SLIDER('Power', 'sizePx', {min: 0, max: 9999, step: 1})}
						${F.SLIDER('Brightness', 'brightness', {
							min: 0,
							max: 1,
							step: 0.01,
						})}
						${F.SLIDER('Diffusion', 'diffusion', {min: 0, max: 100, step: 1})}
					</div>
				</div>
			</div>
			<!-- -->`;
	}
}

export const app = (window.app = new AppShell());
